import { SerialPort } from "../../utils/serialport/SerialPort";
import { XModem, XModemSocket } from "../../utils/xmodem/xmodem";
import { Command, CommandState } from "./Command";
import { PingCommand } from "./PingCommand";

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
    DISCONNECTED,
    CONNECTING,
    CONNECTED,
    UNKNOWN_DEVICE
}

const MAX_PING_COUNT = 10;

export class ControllerService {
    serialPort: SerialPort;
    buffer: string;
    commands: Command[];
    xmodemMode: boolean = false;
    status: ControllerStatus = ControllerStatus.DISCONNECTED;

    constructor(serialPort: SerialPort) {
        this.serialPort = serialPort;
        this.buffer = "";
        this.commands = [];
    }

    connect = async (): Promise<ControllerStatus> => {
        if (!this.serialPort.isOpen()) {
            console.log("Connecting to serial port...");
            this.serialPort.addReader(this.onData);
            await this.serialPort.open(115200);

            // Wait for the connection to establish
            await new Promise(r => setTimeout(r, 500));

            await this._detectController().catch(async () => {
                console.error("Could not connect to controller, attempting hard reset.");
                this.hardReset();
                await new Promise(r => setTimeout(r, 1000));
                await this._detectController().catch(() => console.error("Still no contact proceed in restricted mode"));
            });

        }

        return Promise.resolve(this.status);
    };

    _detectController = async (): Promise<void> => {
        // Attemt to establish a connection
        let answered = false;
        let pingCount = 0;
        while (!answered) {
            pingCount++;
            try {
                await this.ping();
                return Promise.resolve();
            } catch (error) {
                console.debug("Waiting for response... " + pingCount);
            }
            if (pingCount >= MAX_PING_COUNT) {
                this.status = ControllerStatus.UNKNOWN_DEVICE;
                return Promise.reject("Could not detect controller...");
            }
        }
    }

    ping = async (): Promise<void> => {
        const pingCommand = new PingCommand();
        try {
            await this.send(pingCommand, 1000);
            this.status = ControllerStatus.CONNECTED;
            return Promise.resolve();
        } catch (error) {
            return Promise.reject();
        }
    }

    disconnect = (): Promise<void> => {
        this.serialPort.removeReader(this.onData);
        return this.serialPort.close();
    };

    onData = (data: Buffer) => {
        if (this.xmodemMode) {
            return;
        }

        this.buffer += data.toString().replace(/\r/g, "");

        let endLineIndex = this.buffer.indexOf("\n");
        while (endLineIndex >= 0) {
            const line = this.buffer.substring(0, endLineIndex);
            this.buffer = this.buffer.substring(endLineIndex + 1);
            console.log("<<< " + line);

            if (this.commands.length) {
                this.commands[0].appendLine(line);
                if (this.commands[0].state == CommandState.DONE) {
                    this.commands = this.commands.slice(1);
                }
            }
            endLineIndex = this.buffer.indexOf("\n");
        }
    };

    send = <T extends Command>(command: T, timeoutMs: number = 0): Promise<T> => {
        this.commands.push(command);
        const result = new Promise<T>((resolve, reject) => {
            let timer;
            if (timeoutMs > 0) {
                timer = setTimeout(() => {
                    this._removeCommand(command);
                    reject("Command timed out");
                }, timeoutMs);
            }
            (command as Command).onDone = async () => {
                if (timer) {
                    clearTimeout(timer);
                }
                resolve(command)
            };
        });
        this.serialPort.write(Buffer.from((command as Command).command + "\n"));
        return result;
    };

    _removeCommand = (command: Command) => {
        this.commands = this.commands.filter(c => c !== command);
    }

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
        const nativePort = this.serialPort.getNativeSerialPort();
        await nativePort.setSignals({ dataTerminalReady: false, requestToSend: true });
        await new Promise(r => setTimeout(r, 100));
        await nativePort.setSignals({ dataTerminalReady: true });
        await new Promise(r => setTimeout(r, 50));
    }
}
