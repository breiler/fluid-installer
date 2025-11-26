import { Command } from "./Command";

export class GetStartupShowCommand extends Command {
    messages: string[];
    constructor() {
        super("$Startup/Show");
        this.messages = [];
    }
    onMsg(tag: string, value: string) {
        if (tag == undefined) {
            this.messages.push("[" + value + "]");
        } else {
            this.messages.push("[" + tag + ":" + value + "]");
        }
    }
    // Home.tsx reads the messages
}
