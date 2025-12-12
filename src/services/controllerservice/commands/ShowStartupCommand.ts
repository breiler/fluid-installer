import { Command } from "./Command";

export class ShowStartupCommand extends Command {
    _startup_lines: string[] = [];
    _has_errors: boolean = false;

    constructor() {
        super("$Startup/Show");
    }
    onMsg(tag: string, value: string) {
        if (tag != "INFO") {
            this._has_errors = true;
        }
        this._startup_lines.push("[MSG:" + tag + ":" + value + "]");
    }
    onText(value: string) {
        this._startup_lines.push(value);
    }
    result(): { hasErrors: boolean; data: string[] } {
        return { hasErrors: this._has_errors, data: this._startup_lines };
    }
}
