import { test, expect } from "@jest/globals";
import { ListFilesCommand } from "../../../../services/controllerservice/commands/ListFilesCommand";

// Lines as ControllerService passes them, with the surrounding [] removed
const listing = [
    "FILE: config.yaml|SIZE:225",
    "DIR:ui",
    "DIR: figui",
    "FILE:   index.html.gz|SIZE:157736",
    "DIR: webui3",
    "FILE:   index.html.gz|SIZE:107835",
    "FILE:  readme.txt|SIZE:10",
    "DIR:empty",
    "FILE: index.html.gz|SIZE:111625",
    "/littlefs Free:12.50 KB Used:179.50 KB Total:192.00 KB"
];

test("ListFilesCommand returns top-level files", () => {
    const command = new ListFilesCommand();
    listing.forEach((line) => command.onPushMsg(line));

    expect(command.result()).toEqual([
        { id: "config.yaml", name: "config.yaml", size: 225 },
        { id: "index.html.gz", name: "index.html.gz", size: 111625 }
    ]);
    expect(command.freeBytes).toBe(12800);
});

test("ListFilesCommand returns top-level directories with total sizes", () => {
    const command = new ListFilesCommand();
    listing.forEach((line) => command.onPushMsg(line));

    expect(command.directories()).toEqual([
        { id: "ui", name: "ui", size: 157736 + 107835 + 10 },
        { id: "empty", name: "empty", size: 0 }
    ]);
});

test("ListFilesCommand lists a subdirectory", () => {
    expect(new ListFilesCommand(false, "ui/figui").command).toBe(
        "$LocalFS/List=/localfs/ui/figui"
    );
    expect(new ListFilesCommand(true, "jobs").command).toBe(
        "$SD/List=/sd/jobs"
    );
    expect(new ListFilesCommand(true).command).toBe("$SD/List");
});
