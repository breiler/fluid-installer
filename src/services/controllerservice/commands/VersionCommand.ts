import { Command } from "./Command";

export class VersionCommand extends Command {
    constructor() {
        super("$Build/Info");
    }

    getVersionNumber = () => {
        const versionLine = this.response.find(
            (line) => line.indexOf("[VER:") === 0
        );
        if (!versionLine) {
            return undefined;
        }

        const versionRegex = new RegExp("^\\[VER:([0-9\\.]+).*$", "g");
        return versionRegex.exec(versionLine)?.at(1) ?? "?";
    };
}
