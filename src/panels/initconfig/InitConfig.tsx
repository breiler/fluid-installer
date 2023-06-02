import React, { MouseEventHandler, useContext, useEffect, useState } from "react";
import { Button } from "../../components";
import { SerialPortContext } from "../../context/SerialPortContext";
import { ControllerService, GetConfigCommand, ListFilesCommand } from "../../services/ControllerService";

type Props = {
    onContinue: MouseEventHandler;
};
const InitConfig = ({ onContinue }: Props) => {
    const serialPort = useContext(SerialPortContext);
    const [configFilename, setConfigFilename] = useState<string>("");
    const [configExists, setConfigExists] = useState<boolean>(false);

    useEffect(() => {
        if(!serialPort) {
            return;
        }

        const controllerService = new ControllerService(serialPort);
        controllerService.connect().then(async () => {
            let command = await controllerService.send(new GetConfigCommand("$Config/Filename"));
            setConfigFilename(command.getValue())
            
            let listFiles = await controllerService.send(new ListFilesCommand());
            setConfigExists(!!listFiles.getFiles().find(file => file.name === command.getValue()));

            controllerService.disconnect();
        });
    }, [serialPort])

    return (
        <>
            {!configExists && (
                <>Missing configuration file: {configFilename}...</>
            )}
        </>
    );
};

export default InitConfig;
