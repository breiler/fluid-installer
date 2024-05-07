import React, { ReactNode, useEffect, useState } from "react";
import { ControllerService } from "../../services";
import Log from "../log/Log";
import { createLogLine } from "../../utils/logutils";

type ControllerLogProps = {
    show: boolean;
    onShow: (show: boolean) => void;
    onError: () => void;
    controllerService?: ControllerService | undefined;
};

let buffer = "";

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
            newRows.push(createLogLine(buffer.slice(0, newLineIndex)));
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
        <Log show={show} onShow={onShow} showExpand={true}>
            {rows}
        </Log>
    );
};

export default ControllerLog;
