import { Command } from "./Command";

type AccessPointInternal = {
    SSID: string;
    SIGNAL: string;
    IS_PROTECTED: string;
};

type AccessPointListInternal = {
    AP_LIST: AccessPointInternal[];
};

export type AccessPoint = {
    ssid: string;
    signal: number;
    isProtected: boolean;
};

export class GetAccessPointListCommand extends Command {
    json: string;
    constructor() {
        super("$Wifi/ListAPs");
        this.json = "";
    }

    onMsg(tag: string, value: string) {
        if (tag == "JSON") {
            this.json += value;
        }
    }

    // Handle the unencapsulated response style
    onText(value: string) {
        this.json += value;
    }

    result(): AccessPoint[] {
        try {
            const accessPoints: AccessPointListInternal = JSON.parse(this.json);
            return accessPoints.AP_LIST.map((a) => ({
                ssid: a.SSID,
                signal: +a.SIGNAL,
                isProtected: a.IS_PROTECTED === "1"
            })).sort((a, b) => b.signal - a.signal);
        } catch (error) {
            console.error("Error parsing accesspoint data: ", error);
        }

        return [];
    }
}
