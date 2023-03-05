import { convertUint8ArrayToBinaryString } from "../utils";
import { NativeSerialPort } from "./typings";

export enum SerialPortState {
    DISCONNECTED,
    CONNECTING,
    CONNECTED,
    DISCONNECTING
}

type SerialReader = (data: string) => void;

export class SerialPort {
    private serialPort: NativeSerialPort;
    private state: SerialPortState = SerialPortState.DISCONNECTED;
    private readers: SerialReader[] = [];
    private reader: ReadableStreamDefaultReader<Uint8Array>;

    constructor(serialPort: NativeSerialPort) {
        this.serialPort = serialPort;
    }

    open = async (baudRate = 115200): Promise<void> => {
        if (this.state === SerialPortState.CONNECTED) {
            return Promise.reject("Already connected");
        }

        this.state = SerialPortState.CONNECTING;
        return this.serialPort.open({ baudRate }).then(() => {
            this.state = SerialPortState.CONNECTED;
            this.startReading();
        });
    };

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
            this.state = SerialPortState.DISCONNECTED;
        });
    };

    getState = (): SerialPortState => {
        return this.state;
    };

    write = async (data: string): Promise<void> => {
        if (this.state !== SerialPortState.CONNECTED) {
            return Promise.reject("Not connected");
        }

        const encoder = new TextEncoder();
        const writer = this.serialPort.writable!.getWriter();
        return writer.write(encoder.encode(data)).finally(() => {
            writer.releaseLock();
        });
    };

    /**
     * Adds a reader that will be noitified everytime there is serial data:
     * @param reader
     */
    addReader = (reader: SerialReader) => {
        this.readers.push(reader);
    };

    private startReading = async () => {
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
                        reader(convertUint8ArrayToBinaryString(value))
                    );
                }
            }
        }
    };
}
