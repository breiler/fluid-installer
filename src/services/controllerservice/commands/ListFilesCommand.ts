import { Command } from "./Command";
import { ControllerFile } from "../types";

// One line of the recursive listing.  FluidNC indents nested entries by
// one space per level: "[DIR:<indent>name" and "[FILE: <indent>name|SIZE:n"
// (FILE has one extra leading space).
type ListEntry = {
    depth: number;
    name: string;
    isDirectory: boolean;
    size: number;
};

export class ListFilesCommand extends Command {
    entries: ListEntry[];
    // From the trailing "[/littlefs Free:98.00 KB Used:...]" line;
    // undefined if the firmware did not report it
    freeBytes: number | undefined;

    /**
     * @param sd list the SD card instead of the local filesystem
     * @param dir directory to list, relative to the filesystem root
     *            ("" or undefined for the root)
     */
    constructor(sd: boolean = false, dir?: string) {
        const base = sd ? "$SD/List" : "$LocalFS/List";
        super(dir ? base + "=" + (sd ? "/sd/" : "/localfs/") + dir : base);
        this.entries = [];
    }

    onPushMsg(line: string) {
        if (line.startsWith("FILE:")) {
            const value = line.substring(6);
            const name = value.substring(0, value.indexOf("|"));
            this.entries.push({
                depth: name.length - name.trimStart().length,
                name: name.trim(),
                isDirectory: false,
                size: parseInt(value.substring(value.indexOf("|SIZE:") + 6))
            });
            return;
        }
        if (line.startsWith("DIR:")) {
            const name = line.substring(4);
            this.entries.push({
                depth: name.length - name.trimStart().length,
                name: name.trim(),
                isDirectory: true,
                size: 0
            });
            return;
        }
        const free = line.match(/ Free:([0-9.]+) (B|KB|MB|GB)/);
        if (free) {
            const scale = { B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3 };
            this.freeBytes = Math.floor(parseFloat(free[1]) * scale[free[2]]);
        }
    }

    /**
     * @returns the files directly in the listed directory
     */
    result(): ControllerFile[] {
        return this.entries
            .filter((entry) => entry.depth === 0 && !entry.isDirectory)
            .map((entry) => ({
                id: entry.name,
                name: entry.name,
                size: entry.size
            }));
    }

    /**
     * @returns the directories directly in the listed directory, with size
     *          set to the total size of the files anywhere beneath them
     */
    directories(): ControllerFile[] {
        const dirs: ControllerFile[] = [];
        let current: ControllerFile | undefined;
        for (const entry of this.entries) {
            if (entry.depth === 0) {
                current = entry.isDirectory
                    ? { id: entry.name, name: entry.name, size: 0 }
                    : undefined;
                if (current) {
                    dirs.push(current);
                }
            } else if (current && !entry.isDirectory) {
                current.size += entry.size;
            }
        }
        return dirs;
    }
}
