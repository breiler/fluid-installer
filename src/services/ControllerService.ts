import { SerialPort } from "../utils/serialport/SerialPort";
import { convertUint8ArrayToBinaryString } from "../utils/utils";
import { XModem, XModemSocket } from "../utils/xmodem/xmodem";

enum CommandState {
    INITIATED,
    SENT,
    DONE,
    TIMED_OUT
}

export class Command {
    command: string;
    response: string[];
    state: CommandState;
    onDone: () => Promise<void>;

    constructor(command: string) {
        this.state = CommandState.INITIATED;
        this.response = [];
        this.command = command;
        this.onDone = () => {
            return Promise.resolve();
        };
    }

    appendLine = (line: string) => {
        this.response.push(line);

        if (line.startsWith("ok") || line.startsWith("error")) {
            this.state = CommandState.DONE;
            if (this.onDone) {
                this.onDone();
            }
        }
    };
}

export class VersionCommand extends Command {
    constructor() {
        super("$I");
    }

    getVersionNumber = () => {
        const versionLine = this.response.find(
            (line) => line.indexOf("[VER:") === 0
        );
        if (!versionLine) {
            return undefined;
        }

        const versionRegex = new RegExp("^\\[VER:([0-9\\.]+).*$", "g");
        console.log(
            versionRegex.source,
            versionLine,
            versionRegex.exec(versionLine)
        );

        return versionRegex.exec(versionLine);
    };
}

export type File = {
    id: string;
    name: string;
    size: number;
};

export class ListFilesCommand extends Command {
    constructor() {
        super("$LocalFS/List");
    }

    getFiles = (): File[] => {
        return this.response
            .filter((line) => line.indexOf("[FILE:") == 0)
            .map((line) => {
                return {
                    id: line.substring(7, line.indexOf("|")),
                    name: line.substring(7, line.indexOf("|")),
                    size: parseInt(
                        line.substring(
                            line.indexOf("|SIZE:") + 6,
                            line.indexOf("]")
                        )
                    )
                };
            }) as File[];
    };
}

export class ReceiveFileCommand extends Command {
    constructor() {
        super("$Xmodem/Receive");
    }
}

class XModemSocketAdapter implements XModemSocket {
    private serialPort: SerialPort;
    private buffer: Buffer = Buffer.from("");

    constructor(serialPort: SerialPort) {
        this.serialPort = serialPort;
        this.serialPort.addReader((d) => this.onData(d));
    }

    onData(data: Buffer) {
        this.buffer = Buffer.concat([this.buffer, data]);
    }

    write(buffer) {
        return this.serialPort.write(convertUint8ArrayToBinaryString(buffer));
    }

    read(): Promise<Buffer> {
        const result = this.buffer;
        this.buffer = Buffer.alloc(0);
        return Promise.resolve(result);
    }

    peekByte(): Promise<Buffer> {
        if (this.buffer.length === 0) {
            return Promise.resolve(Buffer.alloc(0));
        }

        const result = this.buffer.subarray(0, 1);
        return Promise.resolve(result);
    }

    readByte(): Promise<Buffer> {
        if (this.buffer.length === 0) {
            return Promise.resolve(Buffer.alloc(0));
        }

        const result = this.buffer.subarray(0, 1);
        this.buffer = this.buffer.subarray(1);
        return Promise.resolve(result);
    }

    close() {
        this.serialPort.removeReader(this.onData);
    }
}

export class ControllerService {
    serialPort: SerialPort;
    buffer: string;
    commands: Command[];
    xmodemMode: boolean = false;

    constructor(serialPort: SerialPort) {
        this.serialPort = serialPort;
        this.buffer = "";
        this.commands = [];
    }

    connect = (): Promise<void> => {
        this.serialPort.addReader(this.onData);
        return this.serialPort.open(115200);
    };

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

    send = <T>(command: T): Promise<T> => {
        this.commands.push(command as Command);
        const result = new Promise<T>((resolve) => {
            (command as Command).onDone = async () => resolve(command);
        });
        this.serialPort.write((command as Command).command + "\n");
        return result;
    };

    fetchFile = async (file: string): Promise<Buffer> => {
        this.xmodemMode = true;
        await this.serialPort.write("$X\r\n");
        await new Promise((resolve) => setTimeout(resolve, 1000));

        await this.serialPort.write("$Xmodem/Send=" + file + "\r\n");
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const xmodem = new XModem(new XModemSocketAdapter(this.serialPort));
        const fileData = await xmodem.receive();
        this.xmodemMode = false;

        return Promise.resolve(fileData);
    };
}
