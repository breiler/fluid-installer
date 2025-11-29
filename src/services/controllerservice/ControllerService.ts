import {
    SerialBufferedReader,
    SerialPort
} from "../../utils/serialport/SerialPort";
import { NativeSerialPortEvent } from "../../utils/serialport/typings";
import { sleep } from "../../utils/utils";
import { XModem, XModemSocket } from "../../utils/xmodem/xmodem";
import { Command, CommandState } from "./commands/Command";
import { GetStatsCommand, Stats } from "./commands/GetStatsCommand";

class XModemSocketAdapter implements XModemSocket {
    private serialPort: SerialPort;
    private buffer: Buffer = Buffer.alloc(0);
    private unregister: () => void;

    constructor(serialPort: SerialPort) {
        this.serialPort = serialPort;

        // Registers a reader and store the function for unregistering
        this.unregister = this.serialPort.addReader((data) =>
            this.onData(data)
        );
    }

    onData(data: Buffer) {
        if (!this.buffer) {
            this.buffer = data;
        } else {
            this.buffer = Buffer.concat([this.buffer, data]);
        }
    }

    write(buffer) {
        return this.serialPort.write(buffer);
    }

    read(): Promise<Buffer> {
        const result = this.buffer;
        this.buffer = Buffer.alloc(0);
        return Promise.resolve(result);
    }

    peekByte(): Promise<number | undefined> {
        return Promise.resolve(this.buffer.at(0));
    }

    close() {
        this.unregister && this.unregister();
    }
}

export enum ControllerStatus {
    CONNECTION_LOST,
    DISCONNECTED,
    CONNECTING,
    CONNECTED,
    UNKNOWN_DEVICE
}

export type ControllerStatusListener = (status: ControllerStatus) => void;

export class ControllerService {
    serialPort: SerialPort;
    buffer: string;
    commands: Command[];
    xmodemMode: boolean = false;
    _status: ControllerStatus = ControllerStatus.DISCONNECTED;
    currentVersion: string | undefined;
    statusListeners: ControllerStatusListener[];
    stats: Stats;

    constructor(serialPort: SerialPort) {
        this.serialPort = serialPort;
        this.buffer = "";
        this.commands = [];
        this.statusListeners = [];
    }

    async getStats() {
        if (this.currentVersion) {
            try {
                const command = await this.send(new GetStatsCommand(), 5000);
                this.stats = command.result();
            } catch (error) {
                console.warn("Could not retreive the controller status", error);
            }
        }
        return this.stats;
    }

    connect = async (): Promise<ControllerStatus> => {
        let success: boolean = false;
        if (!this.serialPort.isOpen()) {
            const bufferedReader = new SerialBufferedReader();
            await this.serialPort.open(115200);

            this.serialPort
                .getNativeSerialPort()
                .addEventListener(
                    NativeSerialPortEvent.DISCONNECT,
                    () => (this.status = ControllerStatus.CONNECTION_LOST)
                );

            try {
                this.serialPort.addReader(bufferedReader.getReader());
                // Send reset echo mode and reset controller
                await this.serialPort.write(Buffer.from([0x0c, 0x18]));
                success = await this._initializeController(bufferedReader);
            } finally {
                this.serialPort.removeReader(bufferedReader.getReader());
            }

            if (success) {
                this.status = ControllerStatus.CONNECTED;
                this.serialPort.addReader(this.onData);
            } else {
                this.status = ControllerStatus.UNKNOWN_DEVICE;
            }
        }

        if (success) {
            await this.getStats();
        }

        return Promise.resolve(this.status);
    };

    private async _initializeController(
        bufferedReader: SerialBufferedReader
    ): Promise<boolean> {
        const gotWelcomeString =
            await this.waitForWelcomeString(bufferedReader);
        if (gotWelcomeString) {
            await this.waitForSettle(bufferedReader);

            // Clear send and read buffers
            await this.serialPort.write(Buffer.from("\n"));
            await bufferedReader.waitForLine(2000);

            // Try and query for version
            await this.serialPort.write(Buffer.from("$Build/Info\n"));
            const versionResponse = await bufferedReader.waitForLine(2000);
            this.currentVersion = versionResponse.toString();
            await this.waitForSettle(bufferedReader);
            return true;
        }
        return false;
    }

    private async waitForSettle(
        bufferedReader: SerialBufferedReader,
        waitTimeMs = 500
    ) {
        while ((await bufferedReader.waitForLine(waitTimeMs)).length > 0) {
            await sleep(100);
        }
    }

    private async waitForWelcomeString(
        bufferedReader: SerialBufferedReader
    ): Promise<boolean> {
        console.log("Waiting for welcome string");
        const currentTime = Date.now();
        let fastFlashResponses = 0;
        while (currentTime + 15000 > Date.now()) {
            try {
                const response = await bufferedReader.readLine();
                if (this.isWelcomeString(response.toString())) {
                    console.log("Found welcome message: " + response);
                    return true;
                }

                if (this.isFastFlashBootString(response.toString())) {
                    fastFlashResponses++;
                    if (fastFlashResponses >= 3) {
                        console.log("Controller is in a reboot loop");
                        this.serialPort.holdReset();
                        return false;
                    }
                }
                await sleep(100);
            } catch (error) {
                console.log(error);
            }
        }

        console.log("Could not detect welcome string");
        return false;
    }

    private isFastFlashBootString(response: string) {
        return (
            response.indexOf("SPI_FAST_FLASH_BOOT") > 0 ||
            response.indexOf("rst:") > 0
        );
    }

    async disconnect(notify = true): Promise<void> {
        this.serialPort.removeReader(this.onData);
        if (notify) {
            this.status = ControllerStatus.DISCONNECTED;
        }
        return this.serialPort.close();
    }

    onData = (data: Buffer) => {
        if (this.xmodemMode) {
            return;
        }

        this.buffer += data.toString().replace(/\r/g, "");

        let endLineIndex = this.buffer.indexOf("\n");
        while (endLineIndex >= 0) {
            let line = this.buffer.substring(0, endLineIndex);
            this.buffer = this.buffer.substring(endLineIndex + 1);

            if (this.commands.length) {
                const command = this.commands[0];
                if (command.debugReceive) {
                    console.log("<<< " + line);
                }
                if (line.startsWith("<")) {
                    // Get Status Report (?) is uniquely a single-character command
                    // whose response does not end with "ok" or "error"
                    command.onStatusReport(line.slice(1, -1));
                } else if (line.startsWith("ok")) {
                    // Format is just "ok"
                    command.onDone();
                } else if (line.startsWith("error")) {
                    command.onError(line);
                } else if (line.startsWith("[")) {
                    if (line.endsWith("]")) {
                        line = line.slice(1, -1);
                        const pos = line.indexOf(":");
                        let tag: string;
                        let value: string;
                        if (pos == -1) {
                            tag = line;
                            value = undefined;
                        } else {
                            tag = line.substring(0, pos);
                            value = line.substring(pos + 1);
                        }
                        command.onMsg(tag, value);
                    } else {
                        console.error("Unterminated message " + line);
                    }
                } else if (line.startsWith("$")) {
                    line = line.substring(1);
                    let name: string;
                    let value: string;
                    const pos = line.indexOf("=");
                    if (pos == -1) {
                        name = line;
                        value = undefined;
                    } else {
                        name = line.substring(0, pos);
                        value = line.substring(pos + 1);
                    }
                    command.onItem(name, value);
                } else {
                    command.onText?.(line);
                }

                if (command.state == CommandState.DONE) {
                    this.commands = this.commands.slice(1);
                }
            } else if (line.length) {
                console.log("<<< " + line);
            }

            endLineIndex = this.buffer.indexOf("\n");
        }
    };

    write = async (data: Buffer) => {
        // Waiting for other commands to finish
        while (this.commands.length > 0) {
            await sleep(100);
        }
        await this.serialPort.write(data);
        await sleep(100);
    };

    send = async <T extends Command>(
        command: T,
        timeoutMs: number = 0
    ): Promise<T> => {
        if (this.status !== ControllerStatus.CONNECTED) {
            return command;
        }

        if (command.debugSend) {
            console.log("sending " + command.command);
        }

        // Waiting for other commands to finish
        while (this.commands.length > 0) {
            await sleep(100);
        }

        this.commands.push(command);
        const result = new Promise<T>((resolve, reject) => {
            let timer;
            if (timeoutMs > 0) {
                timer = setTimeout(() => {
                    this._removeCommand(command);
                    reject("Command timed out");
                }, timeoutMs);
            }

            (command as Command).addListener(() => {
                if (timer) {
                    clearTimeout(timer);
                }
                resolve(command);
            });
        });

        this.serialPort.write(Buffer.from((command as Command).command + "\n"));
        return result;
    };

    _removeCommand = (command: Command) => {
        this.commands = this.commands.filter((c) => c !== command);
    };

    downloadFile = async (file: string): Promise<Buffer> => {
        this.xmodemMode = true;
        await this.serialPort.write(Buffer.from("$X\r\n"));
        await new Promise((resolve) => setTimeout(resolve, 300));

        await this.serialPort.write(
            Buffer.from("$Xmodem/Send=" + file + "\r\n")
        );
        await new Promise((resolve) => setTimeout(resolve, 500));

        const xmodem = new XModem(new XModemSocketAdapter(this.serialPort));
        const fileData = await xmodem.receive();
        xmodem.close();
        this.xmodemMode = false;

        return Promise.resolve(fileData);
    };

    uploadFile = async (file: string, fileData: Buffer): Promise<void> => {
        this.xmodemMode = true;
        await this.serialPort.write(Buffer.from("$X\r\n"));
        await new Promise((resolve) => setTimeout(resolve, 300));

        await this.serialPort.write(
            Buffer.from("$Xmodem/Receive=" + file + "\r\n")
        );
        await new Promise((resolve) => setTimeout(resolve, 500));

        const xmodem = new XModem(new XModemSocketAdapter(this.serialPort));
        await xmodem.send(fileData);
        xmodem.close();
        this.xmodemMode = false;

        await new Promise((resolve) => setTimeout(resolve, 3000));
        return Promise.resolve();
    };

    hardReset = async () => {
        this.status = ControllerStatus.CONNECTING;
        await this.serialPort.hardReset();
        const bufferedReader = new SerialBufferedReader();

        try {
            this.serialPort.addReader(bufferedReader.getReader());
            const okay = await this._initializeController(bufferedReader);
            this.status = okay
                ? ControllerStatus.CONNECTED
                : ControllerStatus.UNKNOWN_DEVICE;
        } finally {
            this.serialPort.removeReader(bufferedReader.getReader());
        }
        return Promise.resolve();
    };

    private isWelcomeString(response: string | undefined) {
        if (response) {
            //     console.log(response);
        }
        return (
            response &&
            (response.startsWith("GrblHAL ") ||
                response.startsWith("Grbl ") ||
                response.indexOf(" [FluidNC v") > 0)
        );
    }

    addListener(listener: ControllerStatusListener) {
        this.statusListeners.push(listener);
    }

    removeListener(listener: ControllerStatusListener) {
        this.statusListeners = this.statusListeners.filter(
            (l) => l !== listener
        );
    }

    set status(status: ControllerStatus) {
        this._status = status;
        this.statusListeners.forEach((l) => l(status));
    }

    get status(): ControllerStatus {
        return this._status;
    }
}
