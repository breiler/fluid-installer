import { test, expect } from "@jest/globals";
import { GetStatusCommand } from "../../../../services/controllerservice/commands/GetStatusCommand";

test("GetStatusCommand ", () => {
    const command = new GetStatusCommand();
    command.onStatusReport(
        "Idle|MPos:1.000,10.000,100.000|FS:0,0|WCO:0.000,0.000,0.000"
    );

    const stats = command.result();
    expect(stats.state).toBe("Idle");
    expect(stats.machine.x).toBe(1);
    expect(stats.machine.y).toBe(10);
    expect(stats.machine.z).toBe(100);
    expect(stats.machine.a).toBeUndefined();
    expect(stats.machine.b).toBeUndefined();
    expect(stats.machine.c).toBeUndefined();
});
