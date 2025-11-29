import { Command } from "./Command";

export class VersionCommand extends Command {
    version: string;
    constructor() {
        super("$Build/Info");
        this.version = "?";
    }

    onMsg(tag: string, value: string) {
        if (tag == "VER") {
            const match = value.match(/^([0-9.]+)/);
            this.version = match?.[1] ?? "?";
        }
    }

    result(): string {
        return this.version;
    }
}
