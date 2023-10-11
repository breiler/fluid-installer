import React, { useEffect, useState } from "react";

export const Version = () => {
    const [version, setVersion] = useState<string>();

    useEffect(() => {
        /*const controllerService = new ControllerService(serialPort);
        controllerService.connect().then(async () => {
            const versionCommand = await controllerService.send(new VersionCommand());
            setVersion(versionCommand.getVersionNumber());
            controllerService.disconnect();
        });*/
    }, [setVersion]);

    return (
        <>
            {version && (
                <>
                    <h4>Currently installed:</h4> {version}
                </>
            )}
        </>
    );
};
