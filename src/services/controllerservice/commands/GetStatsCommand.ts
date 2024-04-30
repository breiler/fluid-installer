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
    wifiSignal?: string;
    flashSize?: string;
    cpuTemperature?: string;
    currentWifiMode?: string;
    connectedTo?: string;
};

export class GetStatsCommand extends Command {
    constructor() {
        super("$System/Stats");
    }

    getStats(): Stats {
        return {
            version: this.getParam("FW version: "),
            ip: this.getParam("IP: "),
            hostname: this.getParam("Hostname: "),
            ipMode: this.getParam("IP Mode: "),
            gateway: this.getParam("Gateway: "),
            netmask: this.getParam("Mask: "),
            dns: this.getParam("DNS: "),
            channel: this.getParam("Channel: "),
            signal: this.getParam("Signal: "),
            wifiMode: this.getParam("Current WiFi Mode: "),
            wifiSignal: this.getParam("Signal: "),
            flashSize: this.getParam("Flash Size: "),
            cpuTemperature: this.getParam("CPU Temperature: "),
            currentWifiMode: this.getParam("Current WiFi Mode: "),
            apSSID: this.getParam("SSID: "),
            connectedTo: this.getParam("Connected to: ")
        };
    }

    getParam(param: string): string | undefined {
        return this.response
            .find((line) => line.indexOf(param) === 0)
            ?.substring(param.length);
    }
}
