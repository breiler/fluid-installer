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

    const run = async () => {
        const command = await controllerService.send(
            new GetConfigFilenameCommand()
        );
        setConfigFilename(command.result());

        const listFiles = await controllerService.send(new ListFilesCommand());
        setConfigExists(
            !!listFiles.result().find((file) => file.name === command.result())
        );

        controllerService.disconnect();
    };

    useEffect(() => {
        if (!controllerService) {
            return;
        }
        run();
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
