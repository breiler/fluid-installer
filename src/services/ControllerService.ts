import { SerialPort } from "../utils/serialport/SerialPort";
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

    getCommand() {
        return this.command;
    }
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

export class DeleteFileCommand extends Command {
    constructor(file: string) {
        super("$LocalFS/Delete=/localfs/" + file);
    }
}

export class ReceiveFileCommand extends Command {
    constructor() {
        super("$Xmodem/Receive");
    }
}

export class GetConfigCommand extends Command {

    constructor(config: string) {
        super(config);
    }

    getValue(): string {
        const response = this.response.find((line) => line.indexOf(this.getCommand()) === 0);
        if (!response) {
            return "";
        }

        return response.substring(this.getCommand().length + 1);
    }
}

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
        if (!this.serialPort.isOpen()) {
            return this.serialPort.open(115200);
        }
        return Promise.resolve();
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
        this.serialPort.write(Buffer.from((command as Command).command + "\n"));
        return result;
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
}
