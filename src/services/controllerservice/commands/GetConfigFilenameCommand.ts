import { Command } from "./Command";

export class GetConfigFilenameCommand extends Command {
    filename: string;
    constructor() {
        super("$Config/Filename");
        this.filename = "config.yaml";
    }

    onItem(name: string, value: string) {
        if (name == "Config/Filename") {
            this.filename = value;
        }
    }

    result(): string {
        return this.filename;
    }
}
