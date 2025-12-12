import { Command } from "./Command";

type Response = {
    data?: ResponseData[];
};

type ResponseData = {
    id: string;
    value: string;
};

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
    _stats: Stats = {};
    json: string;

    constructor() {
        super("[System/Stats]json=yes");
        this.json = "";
        this.addListener(() => {
            this._updateData();
        });
    }

    // Handle the encapsulated response style
    onMsg(tag: string, value: string) {
        if (tag == "JSON") {
            this.json += value;
        }
    }

    // Handle the unencapsulated response style
    onText(value: string) {
        this.json += value;
    }

    result(): Stats {
        return this._stats;
    }

    _getParam(object: Response, param: string): string | undefined {
        return object?.data?.find((field) => field.id === param)?.value;
    }

    _updateData() {
        if (this.json.length == 0) {
            // The noradio version does not implement System/Stats
            console.log(
                "No response to System/Stats command.  Noradio version?"
            );
            return;
        }
        try {
            const data = JSON.parse(this.json);

            this._stats = {
                version: this._getParam(data, "FW version"),
                ip: this._getParam(data, "IP"),
                hostname: this._getParam(data, "Hostname"),
                ipMode: this._getParam(data, "IP Mode"),
                gateway: this._getParam(data, "Gateway"),
                netmask: this._getParam(data, "Mask"),
                dns: this._getParam(data, "DNS"),
                channel: this._getParam(data, "Channel"),
                signal: this._getParam(data, "Signal"),
                wifiMode: this._getParam(data, "Current WiFi Mode"),
                flashSize: this._getParam(data, "Flash Size"),
                cpuTemperature: this._getParam(data, "CPU Temperature"),
                currentWifiMode: this._getParam(data, "Current WiFi Mode"),
                apSSID: this._getParam(data, "SSID"),
                connectedTo: this._getParam(data, "Connected to")
            };
        } catch (error) {
            console.error("Could not parse ", error);
        }
    }
}
