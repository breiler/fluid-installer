import { Command } from "./Command";

export class DeleteFileCommand extends Command {
    constructor(fileSystem: "/sd/" | "/localfs/", file: string) {
        super(
            fileSystem === "/sd/"
                ? "$SD/Delete=/sd/" + file
                : "$LocalFS/Delete=/localfs/" + file
        );
    }
}
