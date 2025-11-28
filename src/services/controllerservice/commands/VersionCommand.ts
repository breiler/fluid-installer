import { Command } from "./Command";

export class VersionCommand extends Command {
    version: string;
    constructor() {
        super("$Build/Info");
        this.version = "?";
    }

    onMsg(tag: string, value: string) {
        if (tag == "VER") {
            const versionRegex = new RegExp("^([0-9\\.]+).*$", "g");
            this.version = versionRegex.exec(value?.at(1)) ?? "?";
        }
    }

    result(): string {
        return this.version;
    }
}
