import { Command } from "./Command";

export class ShowStartupCommand extends Command {
    _startupLines: string[] = [];
    _hasErrors: boolean = false;

    constructor() {
        super("$Startup/Show");
    }
    onPushMsg(line: string) {
        if (line.startsWith("MSG:")) {
            if (line.substring(4).startsWith("ERR:")) {
                this._hasErrors = true;
            }
        }
        this._startupLines.push("[" + line + "]");
    }
    onText(value: string) {
        this._startupLines.push(value);
    }
    result(): { hasErrors: boolean; lines: string[] } {
        return { hasErrors: this._hasErrors, lines: this._startupLines };
    }
}
