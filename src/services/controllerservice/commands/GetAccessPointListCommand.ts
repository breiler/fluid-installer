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
    constructor() {
        super("$Wifi/ListAPs");
    }

    getAccessPoints = (): AccessPoint[] => {
        try {
            const r = this.response
                .filter(
                    (line) =>
                        !line.startsWith("[MSG") &&
                        !line.startsWith("[OPT") &&
                        !line.startsWith("$Wifi")
                )
                .slice(0, -1)
                .join("");
            const accessPoints: AccessPointListInternal = JSON.parse(r);
            return accessPoints.AP_LIST.map((a) => ({
                ssid: a.SSID,
                signal: +a.SIGNAL,
                isProtected: a.IS_PROTECTED === "1"
            })).sort((a, b) => a.signal - b.signal);
        } catch (error) {
            console.error(
                "An error occured while trying to parse accesspoint data",
                this.response,
                error
            );
        }

        return [];
    };
}
