import React, { ReactNode, useEffect, useState } from "react";
import { ControllerService } from "../../services";
import Log from "../log/Log";

type ControllerLogProps = {
    show: boolean;
    onShow: (show: boolean) => void;
    onError: () => void;
    controllerService?: ControllerService | undefined;
};

let buffer = "";

const createLine = (line: string) => {
    line.replace("<", "&lt;");
    line = line.replace(/MSG:ERR/g, "<span class='red'>$&</span>");
    line = line.replace(/MSG:INFO/g, "<span class='green'>$&</span>");
    line = line.replace(/MSG:WARN/g, "<span class='yellow'>$&</span>");
    line = line.replace(/MSG:DBG/g, "<span class='yellow'>$&</span>");
    line = line.replace(/&lt;Alarm/g, "&lt;<span class='red'>Alarm</span>");
    line = line.replace(/&lt;Run/g, "&lt;<span class='green'>Run</span>");
    line = line.replace(/&lt;Idle/g, "&lt;<span class='green'>Idle</span>");
    line = line.replace(/error:/g, "<span class='red'>error:</span>");

    return <div dangerouslySetInnerHTML={{ __html: line }} />;
};

const ControllerLog = ({
    show = false,
    onShow,
    onError,
    controllerService
}: ControllerLogProps) => {
    const [rows, setRows] = useState<ReactNode[]>([]);

    const reader = (data) => {
        buffer = buffer + data.toString();
        const newRows: ReactNode[] = [];
        while (buffer.indexOf("\n") > -1) {
            const newLineIndex = buffer.indexOf("\n");
            newRows.push(createLine(buffer.slice(0, newLineIndex)));
            buffer = buffer.slice(newLineIndex + 1);
        }
        setRows((rows) => [...rows, ...newRows]);
    };

    useEffect(() => {
        controllerService?.serialPort.addReader(reader);
        return () => controllerService?.serialPort.removeReader(reader);
    }, [controllerService, reader]);

    useEffect(() => {
        if (buffer.indexOf("[MSG:ERR:") > -1) {
            onError();
        }
    }, [buffer]);

    return (
        <Log show={show} onShow={onShow}>
            {rows}
        </Log>
    );
};

export default ControllerLog;
