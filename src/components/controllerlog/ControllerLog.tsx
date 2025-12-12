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

const buffer = "";

const ControllerLog = ({
    show = false,
    onShow,
    onError,
    controllerService
}: ControllerLogProps) => {
    const [rows, setRows] = useState<ReactNode[]>([]);

    const reader = (line) => {
        setRows((rows) => [...rows, createLogLine(line)]);
    };

    useEffect(() => {
        controllerService?.serialPort.addLineReader(reader);
        return () => controllerService?.serialPort.removeLineReader(reader);
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
