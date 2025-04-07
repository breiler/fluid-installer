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
    constructor() {
        super("?");
    }

    getStatus(): Status {
        const statusLine = this.response.find((line) => line.startsWith("<"));

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
