import { test, expect } from "@jest/globals";
import { VersionCommand } from "../../../../services/controllerservice/commands/VersionCommand";

test("VersionCommand with correct version", () => {
    const command = new VersionCommand();
    command.onMsg("VER", "4.0 FluidNC v4.0.0-pre2:");
    expect(command.result()).toBe("4.0");
});

test("VersionCommand unkown version", () => {
    const command = new VersionCommand();
    command.onMsg("VER", "banana");
    expect(command.result()).toBe("?");
});

test("VersionCommand empty version", () => {
    const command = new VersionCommand();
    command.onMsg("VER", "");
    expect(command.result()).toBe("?");
});
