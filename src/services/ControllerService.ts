import { SerialPort } from "../utils/serialport/SerialPort";

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
        const versionLine = this.response.find(line => line.indexOf("[VER:") === 0)
        return versionLine;
    }
}

export class ControllerService {
    serialPort: SerialPort;
    buffer: string;
    commands: Command[];

    constructor(serialPort: SerialPort) {
        this.serialPort = serialPort;
        this.buffer = "";
        this.commands = [];
        this.serialPort.addReader((data) => this.onData(data));
    }

    connect = (): Promise<void> => {
        return this.serialPort.open(115200);
    };

    disconnect = (): Promise<void> => {
        return this.serialPort.close();
    };

    onData = (data: string) => {
        this.buffer += data;

        let endLineIndex = this.buffer.indexOf("\n");
        while (endLineIndex >= 0) {
            const line = this.buffer.substring(0, endLineIndex);
            this.buffer = this.buffer.substring(endLineIndex + 1);
            console.log("<<< " + line);

            this.commands[0].appendLine(line);
            if (this.commands[0].state == CommandState.DONE) {
                this.commands = this.commands.slice(1);
            }
            endLineIndex = this.buffer.indexOf("\n");
        }
    };

    send = <T>(command: T): Promise<T> => {
        console.log(">>> " + command);
        this.commands.push(command as Command);
        const result = new Promise<T>((resolve) => {
            (command as Command).onDone = async () => resolve(command);
        });
        this.serialPort.write((command as Command).command + "\n");
        return result;
    };
}
