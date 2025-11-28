import { test, expect } from "@jest/globals";
import { GetStatsCommand } from "../../../../services/controllerservice/commands/GetStatsCommand";

test("GetStatsCommand", () => {
    const command = new GetStatsCommand();
    command.onMsg(
        "JSON",
        '{"cmd":"420","status":"ok","data":[{"id":"SSID","value":"test1"},'
    );
    command.onMsg("JSON", '{"id":"Connected to","value":"test2"}]}');
    command._updateData();

    const stats = command.result();
    expect(stats.apSSID).toBe("test1");
    expect(stats.connectedTo).toBe("test2");
});
