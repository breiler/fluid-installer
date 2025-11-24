export enum CommandState {
    INITIATED,
    SENT,
    DONE,
    TIMED_OUT
}

type StateListener = (state: CommandState) => void;

export class Command {
    command: string;
    response: string[];
    state: CommandState;

    /**
     * Set to true to debug log when the command is being sent
     */
    debugSend: boolean;

    /**
     * Set to true to debug log when the response data is received
     */
    debugReceive: boolean;

    listeners: StateListener[] = [];

    addListener(listener: StateListener) {
        this.listeners.push(listener);
    }

    constructor(command: string) {
        this.state = CommandState.INITIATED;
        this.response = [];
        this.command = command;
    }

    appendLine = (line: string) => {
        this.response.push(line);

        if (line.startsWith("ok") || line.startsWith("error")) {
            this.state = CommandState.DONE;
            this.listeners.forEach((listener) => listener(CommandState.DONE));
        }
    };

    getCommand() {
        return this.command;
    }
}
