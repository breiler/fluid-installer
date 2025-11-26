import { Command } from "./Command";

export type Settings = Map<string, string>;

export class GetSettingsCommand extends Command {
    items: Map<string, string>;
    constructor() {
        super("$Settings/List");
        this.items = new Map<string, string>();
    }

    onItem(name: string, value: string) {
        this.items.set(name, value);
    }

    result(): Settings {
        return this.items;
    }
}
