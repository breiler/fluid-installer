import { ESPLoader, Transport } from "esptool-js";
import { DeviceInfo, espLoaderTerminal } from "../flash";
import { NativeSerialPort } from "./typings";
import { Buffer } from "buffer";
import { sleep } from "../utils";

export enum SerialPortState {
    DISCONNECTED,
    CONNECTING,
    CONNECTED,
    DISCONNECTING
}

export type SerialReader = (data: Buffer) => void;

export class SerialBufferedReader {
    clear() {
        this.buffer = Buffer.from([]);
    }
    private buffer: Buffer = Buffer.from([]);

    private reader: SerialReader = (data: Buffer) => {
        this.buffer = Buffer.concat([this.buffer, data]);
    };

    read(): Buffer {
        const result = this.buffer;
        this.buffer = Buffer.from([]);
        return result;
    }

    async readLine(): Promise<Buffer> {
        const index = this.buffer.indexOf("\n");
        if (index >= 0) {
            let line = this.buffer.subarray(0, index);
            this.buffer = this.buffer.subarray(index + 1);
            // remove trailing CR
            if (line.at(line.length - 1) === 13) {
                line = line.subarray(0, line.length - 1);
            }
            return line;
        }

        return Buffer.from([]);
    }

    getReader(): SerialReader {
        return this.reader;
    }

    async waitForLine(timeoutMs: number): Promise<Buffer> {
        const currentTime = Date.now();

        while (currentTime + timeoutMs > Date.now()) {
            const response = await this.readLine();
            if (response.length > 0) {
                return response;
            }
            await sleep(10);
        }

        return Promise.resolve(Buffer.from([]));
    }
}

const FLASH_BAUD_RATE = 921600;

export enum SerialPortEvent {
    DISCONNECTED,
    CONNECTION_ERROR
}

export class SerialPort {
    dispatchEvent(eventType: SerialPortEvent) {
        const listenersList: (() => void)[] =
            this.listeners.get(eventType) ?? [];
        listenersList.forEach((listener) => listener());
    }
    on(eventType: SerialPortEvent, callback: () => void) {
        const listenersList: (() => void)[] =
            this.listeners.get(eventType) ?? [];
        listenersList.push(callback);
        this.listeners.set(eventType, listenersList);
    }

    private listeners: Map<SerialPortEvent, (() => void)[]> = new Map();
    private serialPort: NativeSerialPort;
    private state: SerialPortState = SerialPortState.DISCONNECTED;
    private readers: SerialReader[] = [];
    private reader: ReadableStreamDefaultReader<Uint8Array>;
    private deviceInfo: DeviceInfo;

    constructor(serialPort: NativeSerialPort) {
        this.serialPort = serialPort;
    }

    getInfo = async (): Promise<DeviceInfo> => {
        if (this.deviceInfo) {
            return Promise.resolve(this.deviceInfo);
        }

        if (this.state === SerialPortState.CONNECTED) {
            await this.close();
        }

        const transport = new Transport(this.serialPort);
        try {
            const loader = new ESPLoader(
                transport,
                FLASH_BAUD_RATE,
                espLoaderTerminal
            );
            await loader.main_fn();

            // We need to wait after connecting...
            await new Promise((f) => setTimeout(f, 2000));
            const flashId = await loader.read_flash_id();
            const flashIdLowbyte = (flashId >> 16) & 0xff;

            this.deviceInfo = {
                description: await loader.chip.get_chip_description(loader),
                features: await loader.chip.get_chip_features(loader),
                frequency: await loader.chip.get_crystal_freq(loader),
                mac: await loader.chip.read_mac(loader),
                manufacturer: (flashId & 0xff).toString(16),
                flashId: flashId,
                device:
                    ((flashId >> 8) & 0xff).toString(16) +
                    flashIdLowbyte.toString(16),
                flashSize: loader.DETECTED_FLASH_SIZES[flashIdLowbyte]
            };

            return Promise.resolve(this.deviceInfo);
        } finally {
            // Reset the controller
            await transport.setRTS(true);
            await transport.setDTR(false);
            await new Promise((resolve) => setTimeout(resolve, 100));
            await transport.setDTR(true);
            await new Promise((resolve) => setTimeout(resolve, 100));
            await transport.disconnect();
            await this.open();
        }
        return Promise.reject();
    };

    open = async (baudRate = 115200): Promise<void> => {
        if (this.state === SerialPortState.DISCONNECTING) {
            await new Promise((r) => setTimeout(r, 1000));
        }

        if (this.state === SerialPortState.CONNECTED) {
            return Promise.reject("Already connected");
        }

        this.state = SerialPortState.CONNECTING;
        return this.serialPort
            .open({ baudRate })
            .then(() => {
                this.state = SerialPortState.CONNECTED;
                this.startReading();
            })
            .catch((error) => {
                this.dispatchEvent(SerialPortEvent.CONNECTION_ERROR);
                throw error;
            });
    };

    isOpen() {
        return (
            this.state === SerialPortState.CONNECTED ||
            this.state === SerialPortState.CONNECTING
        );
    }

    close = async (): Promise<void> => {
        if (this.state !== SerialPortState.CONNECTED) {
            return Promise.reject("Not connected");
        }

        this.state = SerialPortState.DISCONNECTING;
        if (this.serialPort.readable?.locked) {
            try {
                this.reader.cancel();
                this.reader.releaseLock();
            } catch (error) {
                // never mind
            }
        }

        return this.serialPort.close().then(() => {
            console.log("SerialPort disconnected");
            this.state = SerialPortState.DISCONNECTED;
        });
    };

    getState = (): SerialPortState => {
        return this.state;
    };

    getReaders(): SerialReader[] {
        return this.readers;
    }

    getNativeSerialPort = (): NativeSerialPort => {
        return this.serialPort;
    };

    write = async (data: Buffer): Promise<void> => {
        if (this.state !== SerialPortState.CONNECTED) {
            return Promise.reject("Not connected");
        }

        try {
            const writer = this.serialPort.writable!.getWriter();
            return writer.write(data).finally(() => {
                writer.releaseLock();
            });
        } catch (error) {
            console.log(
                "Got error while trying to release lock, ignore...",
                error
            );
            return Promise.resolve();
        }
    };

    /**
     * Adds a reader that will be noitified everytime there is serial data
     *
     * @param reader
     * @returns a function for unregistering the reader
     */
    addReader = (reader: SerialReader): (() => void) => {
        this.readers.push(reader);

        // Return method for removing the reader
        return () => this.removeReader(reader);
    };

    removeReader = (reader: SerialReader) => {
        this.readers = this.readers.filter((r) => r !== reader);
    };

    hardReset = async () => {
        await this.serialPort.setSignals({
            dataTerminalReady: false,
            requestToSend: true
        });
        await new Promise((r) => setTimeout(r, 100));
        await this.serialPort.setSignals({ dataTerminalReady: true });
        await new Promise((r) => setTimeout(r, 50));
    };

    private startReading = async () => {
        try {
            while (this.state === SerialPortState.CONNECTED) {
                if (!this.serialPort.readable) {
                    continue;
                }

                this.reader = this.serialPort.readable.getReader();
                while (this.state === SerialPortState.CONNECTED) {
                    const { value, done } = await this.reader.read();
                    if (done) {
                        this.reader.releaseLock();
                        break;
                    }
                    if (value) {
                        this.readers.forEach((reader) =>
                            reader(Buffer.from(value))
                        );
                    }
                }
            }
        } catch (error) {
            this.dispatchEvent(SerialPortEvent.CONNECTION_ERROR);
        }
    };
}
