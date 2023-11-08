import { Command } from "./Command";

export class DeleteFileCommand extends Command {
    constructor(file: string) {
        super("$LocalFS/Delete=/localfs/" + file);
    }
}
