import React, { useEffect, useState } from "react";
import { ControllerService } from "../../services";
import Log from "../log/Log";

type ControllerLogProps = {
    show: boolean;
    onShow: (show: boolean) => void;
    controllerService?: ControllerService | undefined;
};

const ControllerLog = ({
    show = false,
    onShow,
    controllerService
}: ControllerLogProps) => {
    const [buffer, setBuffer] = useState<string>("");

    useEffect(() => {
        const reader = (data) => {
            setBuffer((b) => b + data.toString());
        };
        controllerService?.serialPort.addReader(reader);

        return () => controllerService?.serialPort.removeReader(reader);
    }, [controllerService]);

    return (
        <Log show={show} onShow={onShow}>
            {buffer}
        </Log>
    );
};

export default ControllerLog;
