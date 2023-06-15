import { Command } from "./Command";
import { ControllerFile } from "./types";

export class ListFilesCommand extends Command {
    constructor() {
        super("$LocalFS/List");
    }

    getFiles = (): ControllerFile[] => {
        return this.response
            .filter((line) => line.indexOf("[FILE:") == 0)
            .map((line) => {
                return {
                    id: line.substring(7, line.indexOf("|")),
                    name: line.substring(7, line.indexOf("|")),
                    size: parseInt(
                        line.substring(
                            line.indexOf("|SIZE:") + 6,
                            line.indexOf("]")
                        )
                    )
                };
            }) as ControllerFile[];
    };
}