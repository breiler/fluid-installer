export enum CommandState {
    INITIATED,
    SENT,
    DONE,
    TIMED_OUT
}

type StateListener = (state: CommandState) => void;

export class Command {
    command: string;
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
        this.command = command;
    }

    unwrap(msg: string, tag: string): string | undefined {
        prefix = "[" + tag + ":";
        if (msg.indexOf(prefix) == 0) {
            return msg.slice(prefix.length(), -1);
        } else {
            return undefined;
        }
    }

    onDone() {
        this.listeners.forEach((listener) => listener(CommandState.DONE));
        this.state = CommandState.DONE;
    }

    onError(error: string) {
        console.error("Command ", this.command, "failed with ", error);
        this.onDone();
    }

    getCommand() {
        return this.command;
    }
}
