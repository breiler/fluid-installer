import { Command } from "./Command";
import { ControllerFile } from "../types";

export class ListFilesCommand extends Command {
    constructor(sd: boolean = false) {
        super(sd ? "$SD/List" : "$LocalFS/List");
    }

    getFiles = (): ControllerFile[] => {
        return this.response
            .filter((line) => line.indexOf("[FILE: ") == 0)
            .filter((line) => line.indexOf("[FILE:  ") == -1) // Only allow files in root directory
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
