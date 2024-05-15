import { Command } from "./Command";

export type GpioStatus = {
    id: number;
    pin: string;
    direction: "Input" | "Output";
    state: 0 | 1;
};

const regexp = /^(\d+) (GPIO\d+) ([IO])([01]).*$/;

export class GetGpioDumpCommand extends Command {
    constructor() {
        super("$GPIO/Dump");
    }

    getStatusList(): GpioStatus[] {
        return this.response
            .map((line) => line.match(regexp))
            .filter((matches) => !!matches)
            .map((matches) => {
                return {
                    id: +(matches?.[1] ?? "0"),
                    pin: matches?.[2]?.replace("GPIO", "gpio.") ?? "NO_PIN",
                    direction:
                        (matches?.[3] ?? "I") === "I" ? "Input" : "Output",
                    state: (matches?.[4] ?? "0") === "0" ? 0 : 1
                };
            });
    }
}
