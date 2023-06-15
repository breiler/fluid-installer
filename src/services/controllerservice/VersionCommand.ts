import { Command } from "./Command";

export class VersionCommand extends Command {
    constructor() {
        super("$I");
    }

    getVersionNumber = () => {
        const versionLine = this.response.find(
            (line) => line.indexOf("[VER:") === 0
        );
        if (!versionLine) {
            return undefined;
        }

        const versionRegex = new RegExp("^\\[VER:([0-9\\.]+).*$", "g");
        console.log(
            versionRegex.source,
            versionLine,
            versionRegex.exec(versionLine)
        );

        return versionRegex.exec(versionLine);
    };
}