export enum CommandState {
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