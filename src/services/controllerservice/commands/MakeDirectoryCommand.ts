import { Command } from "./Command";

export class MakeDirectoryCommand extends Command {
    // The error line, if the controller rejected the command (e.g. a
    // FluidNC version without $LocalFS/Mkdir)
    error: string | undefined;

    /**
     * @param dir directory to create, relative to the filesystem root
     */
    constructor(fileSystem: "/sd/" | "/localfs/", dir: string) {
        super(
            fileSystem === "/sd/"
                ? "$SD/Mkdir=/sd/" + dir
                : "$LocalFS/Mkdir=/localfs/" + dir
        );
    }

    onError(error: string) {
        this.error = error;
        super.onError(error);
    }
}
