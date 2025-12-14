import { Command } from "./Command";
import { ControllerFile } from "../types";

export class ListFilesCommand extends Command {
    files: string[];
    constructor(sd: boolean = false) {
        super(sd ? "$SD/List" : "$LocalFS/List");
        this.files = [];
    }

    onPushMsg(line: string) {
        if (line.startsWith("FILE:")) {
            const value = line.substring(5);
            if (!value.startsWith("  ")) {
                // Only files in root directory
                this.files.push(value);
            }
        }
    }

    result(): ControllerFile[] {
        return this.files.map((line) => {
            return {
                id: line.substring(0, line.indexOf("|")).trim(),
                name: line.substring(0, line.indexOf("|")).trim(),
                size: parseInt(line.substring(line.indexOf("|SIZE:") + 6))
            };
        }) as ControllerFile[];
    }
}
