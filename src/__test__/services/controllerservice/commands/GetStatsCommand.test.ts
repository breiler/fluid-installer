import { test, expect } from "@jest/globals";
import { GetStatsCommand } from "../../../../services/controllerservice/commands/GetStatsCommand";

test("GetStatsCommand", () => {
    const command = new GetStatsCommand();
    command.appendLine("<Alarm|Wco:100>");
    command.appendLine(
        '[JSON:{"cmd":"420","status":"ok","data":[{"id":"SSID","value":"test1"},]'
    );
    command.appendLine('[JSON:{"id":"Connected to","value":"test2"}]}]');
    command.appendLine("ok");

    const stats = command.getStats();
    expect(stats.apSSID).toBe("test1");
    expect(stats.connectedTo).toBe("test2");
});
