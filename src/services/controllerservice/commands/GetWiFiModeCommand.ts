import { Command } from "./Command";

export class GetWiFiModeCommand extends Command {
    mode: string;
    constructor() {
        super("$WiFi/Mode");
        this.mode = "STA/AP";
    }

    onItem(name: string, value: string) {
        if (name == "WiFi/Mode") {
            this.mode = value;
        }
    }

    result(): string {
        return this.mode;
    }
}
