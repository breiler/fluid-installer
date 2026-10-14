import { Command } from "./Command";
import { ControllerFile } from "../types";

export class ListFilesCommand extends Command {
    files: string[];
    // From the trailing "[/littlefs Free:98.00 KB Used:...]" line;
    // undefined if the firmware did not report it
    freeBytes: number | undefined;
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
            return;
        }
        const free = line.match(/ Free:([0-9.]+) (B|KB|MB|GB)/);
        if (free) {
            const scale = { B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3 };
            this.freeBytes = Math.floor(parseFloat(free[1]) * scale[free[2]]);
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
