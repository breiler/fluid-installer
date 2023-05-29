import React, { useEffect, useState } from "react";
import Card from "../card";
import Button from "../button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { SerialPort } from "../../utils/serialport/SerialPort";
import {
    ControllerService,
    VersionCommand
} from "../../services/ControllerService";

type InstallCardProps = {
    serialPort: SerialPort;
    onClick: () => void;
};

export const InstallCard = ({ serialPort, onClick }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [version, setVersion] = useState<string>();

    useEffect(() => {
        /*const controllerService = new ControllerService(serialPort);
        controllerService.connect().then(async () => {
            //const versionCommand = await controllerService.send(
            //    new VersionCommand()
            //);
            //setVersion(versionCommand.getVersionNumber());
            //controllerService.disconnect();
        });*/
    }, [setVersion, setIsLoading, serialPort]);
    console.log(version);
    return (
        <Card
            className="select-card"
            footer={
                <Button onClick={onClick}>
                    <>{version ? "Upgrade" : "Install"} FluidNC</>
                </Button>
            }>
            <div className="select-icon">
                <FontAwesomeIcon icon={faDownload} size="4x" />
            </div>
            <>
                <p>{version ? "Upgrade" : "Install"} FluidNC on your controller</p>
                {version && <p>{version}</p>}

            </>
        </Card>
    );
};
