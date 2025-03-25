import { Command } from "./Command";

export type Stats = {
    version?: string;
    ip?: string;
    hostname?: string;
    ipMode?: string;
    gateway?: string;
    netmask?: string;
    dns?: string;
    channel?: string;
    signal?: string;
    apSSID?: string;
    wifiMode?: string;
    flashSize?: string;
    cpuTemperature?: string;
    currentWifiMode?: string;
    connectedTo?: string;
};

export class GetStatsCommand extends Command {
    constructor() {
        super("[System/Stats]json=yes");
    }

    getStats(): Stats {
        if (this.response[0].indexOf("error:") === 0) {
            return {};
        }

        try {
            return {
                version: this.getParam("FW version"),
                ip: this.getParam("IP"),
                hostname: this.getParam("Hostname"),
                ipMode: this.getParam("IP Mode"),
                gateway: this.getParam("Gateway"),
                netmask: this.getParam("Mask"),
                dns: this.getParam("DNS"),
                channel: this.getParam("Channel"),
                signal: this.getParam("Signal"),
                wifiMode: this.getParam("Current WiFi Mode"),
                flashSize: this.getParam("Flash Size"),
                cpuTemperature: this.getParam("CPU Temperature"),
                currentWifiMode: this.getParam("Current WiFi Mode"),
                apSSID: this.getParam("SSID"),
                connectedTo: this.getParam("Connected to")
            };
        } catch (error) {
            console.error("Could not parse ", this.response);
            throw error;
        }
    }

    getParam(param: string): string | undefined {
        const data = this.response
            .filter((line) => !line.startsWith("<"))
            .join("\n")
            .replaceAll("[JSON:", "")
            .replaceAll("]\n", "")
            .replaceAll(/ok$/g, "");

        return JSON.parse(data)?.data?.find(
            (field) => field.id.replace(": ", "") === param
        )?.value;
    }
}
