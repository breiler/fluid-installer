export enum CommandState {
    INITIATED,
    SENT,
    DONE,
    TIMED_OUT
}

type StateListener = (state: CommandState) => void;

export class Command {
    command: string | number;
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

    constructor(command: string | number) {
        this.state = CommandState.INITIATED;
        this.command = command;
    }

    unwrap(msg: string, tag: string): string | undefined {
        const prefix: string = "[" + tag + ":";
        if (msg.indexOf(prefix) == 0) {
            return msg.slice(prefix.length, -1);
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

    getCommand(): string | number {
        return this.command;
    }

    // Individual commands typically override the callback
    // methods for the line types that they expect, so the
    // following default versions should rarely be executed
    onPushMsg(_line: string) {
        // console.trace("onMsg " + _line);
    }

    onItem(name: string, value: string) {
        if (value) {
            console.trace("onItem: " + name + "=" + value);
        } else {
            console.trace("onItem: " + name);
        }
    }

    onText(text: string) {
        console.trace("onText: " + text);
    }

    onStatusReport(_report: string) {
        // console.trace("onStatusReport: " + _report);
    }
}
