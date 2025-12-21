import { SerialPort } from "../../utils/serialport/SerialPort";
import { NativeSerialPortEvent } from "../../utils/serialport/typings";
import { sleep } from "../../utils/utils";
import { XModem, XModemSocket } from "../../utils/xmodem/xmodem";
import {
    Command,
    CommandState,
    GetStatsCommand,
    Stats,
    ResetCommand,
    HardResetCommand,
    BuildInfoCommand,
    GetStatusCommand,
    ShowStartupCommand
} from "../../services";

class XModemSocketAdapter implements XModemSocket {
    private serialPort: SerialPort;
    private buffer: Buffer = Buffer.alloc(0);
    private resolve: (value: Buffer) => void;
    private timer: ReturnType<typeof setTimeout>;

    constructor(serialPort: SerialPort) {
        this.serialPort = serialPort;

        // Registers a reader for exclusive access to the data
        this.serialPort.setExclusiveReader((data) => this.onData(data));
    }

    onData(data: Buffer) {
        if (!this.buffer) {
            this.buffer = data;
        } else {
            this.buffer = Buffer.concat([
                this.buffer,
                data
            ] as readonly Uint8Array[]);
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
        return this.serialPort.write(buffer);
    }

    read(): Promise<Buffer> {
        const result = this.buffer;
        this.buffer = Buffer.alloc(0);
        return Promise.resolve(result);
    }

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
    build: string | undefined;
    statusListeners: ControllerStatusListener[];
    stats: Stats;
    version: string;
    hasErrors: boolean = false;
    looping: boolean = false;
    startupLines: string[] = [];
    hasWiFi: boolean;

    constructor(serialPort: SerialPort) {
        this.serialPort = serialPort;
        this.buffer = "";
        this.commands = [];
        this.statusListeners = [];
    }

    async getStats() {
        if (this.build) {
            try {
                const command = await this.send(new GetStatsCommand(), 5000);
                this.stats = command.result();
            } catch (error) {
                console.warn("Could not retrieve the controller status", error);
            }
        }
        return this.stats;
    }

    connect = async (): Promise<ControllerStatus> => {
        if (this.level++ != 0) {
            return Promise.resolve(this.status);
        }

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
            try {
                await this._initializeController();
                this.status = ControllerStatus.CONNECTED;
            } catch (error) {
                await this.serialPort.close();
                this.status = ControllerStatus.UNKNOWN_DEVICE;
                return Promise.reject("_initializeController: " + error);
            }
        }
        if (!this.looping) {
            await this.getStats();
        }
        return Promise.resolve(this.status);
    };

    private async _getControllerInfo(): Promise<void> {
        // Get version
        const info_cmd = await this.send(new BuildInfoCommand(), 500);
        const r = info_cmd.result();
        this.version = r.version;
        this.build = r.build;
        this.hasWiFi = r.wifiInfo.length != 0;

        if (this.startupLines.length == 0) {
            const startup_cmd = await this.send(new ShowStartupCommand(), 1000);
            const sr = startup_cmd.result();
            this.hasErrors = sr.hasErrors;
            this.startupLines = sr.lines;
        }
    }

    private async _isInResetLoop(): Promise<boolean> {
        try {
            const command = await this.send(new ResetCommand(0x18), 7000);
            const r = command.result();
            if (r.status === "ResetLoop") {
                console.log("Controller is in a reboot loop");
                this.serialPort.holdReset();
                return true;
            }
            this.version = r.version;
            this.build = r.build;
        } catch (_error) {
            // Error is probably "Command timed out", try and reset
            try {
                await this.hardReset();
            } catch (_error) {
                console.log("Hard reset did not work");
                this.serialPort.holdReset();
                return true;
            }
        }

        return false;
    }

    private async _initializeController(): Promise<void> {
        this.startupLines = [];
        let responsive = false;
        await this.send(new GetStatusCommand(), 100)
            .then((_command) => {
                responsive = true;
                // We only want to see if FluidNC is responding to '?';
                // we don't need the actual information
                // const { state, machine } = _command.result();
            })
            .catch(() => {
                responsive = false;
            });

        // Check for critical alarm state and try to cancel it
        if (!responsive) {
            this.looping = await this._isInResetLoop();
            if (this.looping) {
                return Promise.resolve();
            }
        }

        this.looping = false;
        await sleep(200);
        await this.serialPort.writeChar(0x0c); // CTRL-L - disable echo

        try {
            await this._getControllerInfo();
        } catch (error) {
            console.log("Could not get controller info", error);
        }

        return Promise.resolve();
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
                    command.onPushMsg(line.slice(1, -1));
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

    send = async <T extends Command>(
        command: T,
        timeoutMs: number = 0
    ): Promise<T> => {
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
        try {
            const fileData = await xmodem.receive();
            return Promise.resolve(fileData);
        } finally {
            xmodem.close();
        }
    };

    uploadFile = async (file: string, fileData: Buffer): Promise<void> => {
        //        this.xmodemMode = true;
        await this.serialPort.writeln("$X");
        await new Promise((resolve) => setTimeout(resolve, 300));

        await this.serialPort.writeln("$Xmodem/Receive=" + file);
        await new Promise((resolve) => setTimeout(resolve, 500));

        const xmodem = new XModem(new XModemSocketAdapter(this.serialPort));
        try {
            await xmodem.send(fileData);
        } finally {
            xmodem.close();
        }

        await new Promise((resolve) => setTimeout(resolve, 3000));
        return Promise.resolve();
    };

    hardReset = async (): Promise<void> => {
        this.status = ControllerStatus.CONNECTING;
        this.startupLines = null;
        await this.wait();

        const command = new HardResetCommand();
        this.commands.push(command);
        const p = new Promise<HardResetCommand>((resolve, reject) => {
            const timer = setTimeout(() => {
                this._removeCommand(command);
                this.status = ControllerStatus.UNKNOWN_DEVICE;
                reject("Command timed out");
            }, 20000); // Long timeout for WiFi connect

            (command as Command).addListener(() => {
                if (timer) {
                    clearTimeout(timer);
                }
                this.status = ControllerStatus.CONNECTED;
                resolve(command);
            });
        });

        await this.serialPort.hardReset();

        const r = (await p).result();
        this.build = r.build;
        this.hasWiFi = r.build.includes("(wifi)");
        this.hasErrors = r.hasErrors;
        this.startupLines = r.startupLines;
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
