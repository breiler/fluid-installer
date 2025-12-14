import { Command } from "./Command";

export class BuildInfoCommand extends Command {
    _version: string = "";
    _build: string = "";
    _wifiInfo: string[] = [];

    constructor() {
        super("$Build/Info");
    }

    // Handle the encapsulated response style
    onPushMsg(line: string) {
        const fields = line.split(":");
        if (fields.length >= 2) {
            if (fields[0] == "VER") {
                const regex = /([0-9.]*) ([^:]*)/;
                const match = fields[1].match(regex);
                this._version = match?.[1] ?? "";
                this._build = match?.[2] ?? "";
            }
            if (fields[0] == "MSG" && fields[1].startsWith("Mode")) {
                this._wifiInfo.push(fields.slice(1));
            }
        }
    }

    result(): { version: string; build: string; wifiInfo: string } {
        return {
            version: this._version,
            build: this._build,
            wifiInfo: this._wifiInfo
        };
    }
}
