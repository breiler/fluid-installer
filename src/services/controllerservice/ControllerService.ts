import { SerialPort } from "../../utils/serialport/SerialPort";
import { NativeSerialPortEvent } from "../../utils/serialport/typings";
import { sleep } from "../../utils/utils";
import { XModem, XModemSocket } from "../../utils/xmodem/xmodem";
import { Command, CommandState } from "./commands/Command";
import { GetStatsCommand, Stats } from "./commands/GetStatsCommand";
import { ResetCommand } from "./commands/ResetCommand";
import { BuildInfoCommand } from "./commands/BuildInfoCommand";

class XModemSocketAdapter implements XModemSocket {
    private serialPort: SerialPort;
    private buffer: Buffer = Buffer.alloc(0);
    private resolve: (value: Buffer) => void;
    private timer: number;

    constructor(serialPort: SerialPort) {
        this.serialPort = serialPort;

        // Registers a reader for exclusive access to the data
        this.serialPort.setExclusiveReader((data) => this.onData(data));
    }

    onData(data: Buffer) {
        if (data.length > 1) {
            // console.log("got: " + new TextDecoder().decode(data));
            // console.log("got: " + data);
        }
        if (!this.buffer) {
            this.buffer = data;
        } else {
            this.buffer = Buffer.concat([this.buffer, data]);
        }
        if (this.timer) {
            clearTimeout(this.timer);
        }
        if (this.resolve) {
            const result = this.buffer;
            this.buffer = Buffer.alloc(0);
            this.resolve(result);
            this.resolve = undefined;
        }
    }

    write(buffer) {
        this.serialPort.write(buffer);
    }

    read(): Promise<Buffer> {
        const result = this.buffer;
        this.buffer = Buffer.alloc(0);
        return Promise.resolve(result);
    }

    // const withTimeout = (promise: Promise<Buffer>, timeoutMs:number ) => {
    //     const timeoutPromise = new Promise((_, reject) =>
    //         setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
    //                                       );
    //     return Promise.race([promise, timeoutPromise]);
    // }

    async timedRead(timeout: number): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            // onData will resolve the promise
            this.resolve = resolve;
            this.timer = setTimeout(() => {
                reject("Read timed out");
            }, timeout);
        });
    }

    peekByte(): Promise<number | undefined> {
        return Promise.resolve(this.buffer.at(0));
    }

    close() {
        this.serialPort.removeExclusiveReader();
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
    //    xmodemMode: boolean = false;
    level: number = 0;
    _status: ControllerStatus = ControllerStatus.DISCONNECTED;
    currentVersion: string | undefined;
    statusListeners: ControllerStatusListener[];
    stats: Stats;
    version: string;
    build: string;

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
        if (this.level++ != 0) {
            return Promise.resolve(this.status);
        }
        let success: boolean = false;

        // Install the handler to dispatch serial port lines
        // to Command listeners
        this.serialPort.addLineReader(this.onData);

        if (!this.serialPort.isOpen()) {
            await this.serialPort.open(115200);

            this.serialPort
                .getNativeSerialPort()
                .addEventListener(
                    NativeSerialPortEvent.DISCONNECT,
                    () => (this.status = ControllerStatus.CONNECTION_LOST)
                );

            this.status = ControllerStatus.CONNECTING;

            // Reset controller
            success = await this._initializeController();

            if (success) {
                this.status = ControllerStatus.CONNECTED;
            } else {
                this.status = ControllerStatus.UNKNOWN_DEVICE;
            }
        }

        if (success) {
            await this.getStats();
        }

        return Promise.resolve(this.status);
    };

    private async _initializeController(): Promise<boolean> {
        const command = await this.send(new ResetCommand(0x18, 7000));
        const { status, version, build } = command.result();
        this.version = version;
        this.build = build;
        if (status == "Welcome") {
            // Disable echo
            await this.serialPort.writeChar(0x0c); // CTRL-L

            // Get version
            const info_cmd = await this.send(new BuildInfoCommand(), 500);
            this.currentVersion = info_cmd.result();

            return true;
        }
        if (status == "ResetLoop") {
            console.log("Controller is in a reboot loop");
            this.serialPort.holdReset();
            return false;
        }
    }

    async disconnect(notify = true): Promise<void> {
        if (--this.level != 0) {
            return Promise.resolve();
        }
        // Remove the reader that dispatches lines to Command listeners
        this.serialPort.removeLineReader(this.onData);
        if (notify) {
            this.status = ControllerStatus.DISCONNECTED;
        }
        return this.serialPort.close();
    }

    /**
     * Decodes a line of Grbl response data, dispathing its payload
     * to the corresponding function in the current Command object.
     *
     * @param line of data from Grbl/FluidNC
     */
    onData = (line: string) => {
        if (this.commands.length) {
            const command = this.commands[0];
            if (command.debugReceive) {
                console.log("<<< " + line);
            }
            if (line.startsWith("<")) {
                // Unlike line-oriented commands whose response ends
                // with an "ok" or "error" line, GetStatusReport (?)
                // is a single-character command that issues a <..>
                // response line with no additional framing.
                command.onStatusReport(line.slice(1, -1));
            } else if (line == "ok") {
                // Format is just "ok"
                command.onDone();
            } else if (
                typeof command.command == "string" &&
                line == command.command
            ) {
                // Commands are usually sent with echo disabled.
                // Ignore echo-back of commands just in case.
                // This would not work for a hand-typed command that included
                // erasures and whatnot, but here we only expect to see the
                // result of a Command that WebInstaller sent.
                return;
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
            // console.log("<<< " + line);
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

    // Waiting for other commands to finish

    wait = async () => {
        while (this.commands.length > 0) {
            await sleep(100);
        }
    };

    send = async (
        command: Command,
        timeoutMs: number = 0
    ): Promise<Command> => {
        if (this.status === ControllerStatus.DISCONNECTED) {
            return command;
        }

        if (command.debugSend) {
            console.log("sending " + command.command);
        }

        await this.wait();

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

        const toSend = (command as Command).command;
        // Do not add a newline for single-character realtime commands
        if (typeof toSend == "number") {
            await this.serialPort.writeChar(toSend);
        } else {
            await this.serialPort.writeln(toSend);
        }
        return result;
    };

    _removeCommand = (command: Command) => {
        this.commands = this.commands.filter((c) => c !== command);
    };

    downloadFile = async (file: string): Promise<Buffer> => {
        //        this.xmodemMode = true;

        // Cancel possible Alarm state
        await this.serialPort.writeln("$X");
        await new Promise((resolve) => setTimeout(resolve, 300));

        await this.serialPort.writeln("$Xmodem/Send=" + file);
        await new Promise((resolve) => setTimeout(resolve, 500));

        const xmodem = new XModem(new XModemSocketAdapter(this.serialPort));
        const fileData = await xmodem.receive();
        xmodem.close();
        //        this.xmodemMode = false;

        return Promise.resolve(fileData);
    };

    uploadFile = async (file: string, fileData: Buffer): Promise<void> => {
        //        this.xmodemMode = true;
        await this.serialPort.writeln("$X");
        await new Promise((resolve) => setTimeout(resolve, 300));

        await this.serialPort.writeln("$Xmodem/Receive=" + file);
        await new Promise((resolve) => setTimeout(resolve, 500));

        const xmodem = new XModem(new XModemSocketAdapter(this.serialPort));
        await xmodem.send(fileData);
        xmodem.close();
        //        this.xmodemMode = false;

        await new Promise((resolve) => setTimeout(resolve, 3000));
        return Promise.resolve();
    };

    hardReset = async (): Promise<ResetCommand> => {
        this.status = ControllerStatus.CONNECTING;
        await this.wait();

        const command = new ResetCommand("<HardReset>");
        this.commands.push(command);
        await this.serialPort.hardReset();
        const result = new Promise<ResetCommand>((resolve, reject) => {
            const timer = setTimeout(() => {
                this._removeCommand(command);
                this.status = ControllerStatus.UNKNOWN_DEVICE;
                reject("Command timed out");
            }, 10000);

            (command as Command).addListener(() => {
                if (timer) {
                    clearTimeout(timer);
                }
                this.status = ControllerStatus.CONNECTED;
                resolve(command);
            });
        });
        return result;
    };

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
