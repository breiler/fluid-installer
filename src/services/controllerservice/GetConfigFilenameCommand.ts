import { Command } from "./Command";

export class GetConfigFilenameCommand extends Command {
    constructor() {
        super("$Config/Filename");
    }

    getFilename = (): string => {
        return (
            this.response
                .find((line) => line.indexOf("$Config/Filename=") == 0)
                ?.substring(17) ?? "config.yaml"
        );
    };
}
