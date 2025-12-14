import { Command } from "./Command";

export class VersionCommand extends Command {
    version: string;
    constructor() {
        super("$Build/Info");
        this.version = "?";
    }

    onPushMsg(line: string) {
        if (line.startsWith("VER:")) {
            const match = line.substring(4).match(/^([0-9.]+)/);
            this.version = match?.[1] ?? "?";
        }
    }

    result(): string {
        return this.version;
    }
}
