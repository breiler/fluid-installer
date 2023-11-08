import { Command } from "./Command";

export class SetConfigFilenameCommand extends Command {
    constructor(fileName: string) {
        super("$Config/Filename=" + fileName);
    }
}
