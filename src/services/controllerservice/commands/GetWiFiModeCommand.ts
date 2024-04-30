import { Command } from "./Command";

export class GetWiFiModeCommand extends Command {
    constructor() {
        super("$WiFi/Mode");
    }

    getMode = (): string => {
        return (
            this.response
                .find((line) => line.indexOf("$WiFi/Mode=") == 0)
                ?.substring(11) ?? "STA/AP"
        );
    };
}
