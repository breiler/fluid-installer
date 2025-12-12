import { Command } from "./Command";

export type Postion = {
    x?: number;
    y?: number;
    z?: number;
    a?: number;
    b?: number;
    c?: number;
};

export type Status = {
    state: string;
    machine: Postion;
};

export class GetStatusCommand extends Command {
    status_report: string;
    constructor() {
        super(0x3f);
        this.status_report = "";
    }
    onStatusReport(report: string) {
        this.status_report = report;
        this.onDone();
    }

    result(): Status {
        const statusLine = this.status_report;

        const mposStart = statusLine.indexOf("MPos:") + 5;
        const mposEnd = statusLine.indexOf("|", mposStart);
        const mposCoord = statusLine
            .substring(mposStart, mposEnd)
            .split(",")
            .map((value) => Number(value));

        return {
            state: statusLine.substring(1, statusLine.indexOf("|")),
            machine: {
                x: mposCoord?.[0],
                y: mposCoord?.[1],
                z: mposCoord?.[2],
                a: mposCoord?.[3],
                b: mposCoord?.[4],
                c: mposCoord?.[5]
            }
        };
    }
}
