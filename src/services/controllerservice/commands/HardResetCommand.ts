import { Command } from "./Command";

export class HardResetCommand extends Command {
    _response: {
        status: string;
        version: string;
        build: string;
        hasErrors: boolean;
        startupLines: string[];
    } = {
        status: "",
        version: "?",
        build: "?",
        hasErrors: false,
        startupLines: []
    };
    reboots: number = 0;

    constructor() {
        super("<HardReset>");
        console.log("Waiting for welcome string");
    }

    private isWelcomeString(text: string | undefined) {
        if (text) {
            //     console.log(text);
        }
        return (
            text &&
            (text.startsWith("GrblHAL ") ||
                text.startsWith("Grbl ") ||
                text.indexOf(" [FluidNC v") > 0)
        );
    }

    private isRebootString(text: string) {
        return (
            text.indexOf("SPI_FAST_FLASH_BOOT") > 0 || text.indexOf("rst:") > 0
        );
    }

    onDone() {
        // ok does not finish a reset
    }

    onPushMsg(line: string) {
        if (line.includes("ERR:") || line.includes("WARN:")) {
            this._response.hasErrors = true;
        }
        this._response.startupLines.push("[" + line + "]");
    }

    onText(text: string) {
        if (this.isRebootString(text)) {
            if (++this.reboots >= 3) {
                this._response = "ResetLoop";
                super.onDone();
            }
            return;
        }
        if (this.isWelcomeString(text)) {
            console.log("Found welcome message: " + text);
            this._response.status = "Welcome";

            const match = text.match(/Grbl.* ([0-9.]+) \[(.*) '\$'/);
            this._response.version = match?.[1] ?? "?";
            this._response.build = match?.[2] ?? "?";

            super.onDone();
            return;
        }
    }

    result(): string {
        return this._response;
    }
}
