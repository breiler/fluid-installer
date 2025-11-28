import React, { useContext, useEffect, useState } from "react";
import { ControllerServiceContext } from "../../context/ControllerServiceContext";
import {
    GetConfigFilenameCommand,
    ListFilesCommand
} from "../../services/controllerservice";

const InitConfig = () => {
    const controllerService = useContext(ControllerServiceContext);
    const [configFilename, setConfigFilename] = useState<string>("");
    const [configExists, setConfigExists] = useState<boolean>(false);

    useEffect(() => {
        if (!controllerService) {
            return;
        }

        controllerService.connect().then(async () => {
            const command = await controllerService.send(
                new GetConfigFilenameCommand()
            );
            setConfigFilename(command.getFilename());

            const listFiles = await controllerService.send(
                new ListFilesCommand()
            );
            setConfigExists(
                !!listFiles
                    .result()
                    .find((file) => file.name === command.getFilename())
            );

            controllerService.disconnect();
        });
    }, [controllerService]);

    return (
        <>
            {!configExists && (
                <>Missing configuration file: {configFilename}...</>
            )}
        </>
    );
};

export default InitConfig;
