import { Command } from "./Command";

export class BuildInfoCommand extends Command {
    _version: string;

    constructor() {
        super("$Build/Info");
        this._version = undefined;
    }

    // Handle the encapsulated response style
    onMsg(tag: string, value: string) {
        if (tag == "VER") {
            this._version += value;
        }
    }

    result(): string {
        return this._version;
    }
}
