import React, { useEffect, useState } from "react";
import { SerialPort } from "../../utils/serialport/SerialPort";
import { Command, ControllerService, VersionCommand } from "../../services/ControllerService";

type VersionProps = {
    serialPort: SerialPort;
};

export const Version = ({ serialPort }: VersionProps) => {
    const [version, setVersion] = useState<string>();

    useEffect(() => {
        const controllerService = new ControllerService(serialPort);
        controllerService.connect().then(async () => {
            const versionCommand = await controllerService.send(new VersionCommand());
            setVersion(versionCommand.getVersionNumber());
            controllerService.disconnect();
        });

    }, [setVersion]);

    return <>
    {version && <><h4>Currently installed:</h4> {version}</>}</>;
};
