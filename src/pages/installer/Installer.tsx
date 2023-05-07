import React, { useState } from "react";

import Progress from "../../panels/progress/Progress";
import Done from "../../panels/done/Done";
import Firmware from "../../panels/firmware/Firmware";
import { GithubRelease } from "../../services/GitHubService";
import { FirmwareType, InstallService, InstallerState } from "../../services/InstallService";
import { SerialPort } from "../../utils/serialport/SerialPort";
import { FlashProgress } from "../../services/FlashService";

const initialProgress: FlashProgress = {
    fileIndex: 0,
    fileCount: 1,
    fileName: "",
    fileProgress: 0
};

type InstallerProps = {
    onClose: () => void;
    serialPort: SerialPort;
};

const Installer = ({ onClose, serialPort }: InstallerProps) => {
    const [state, setState] = useState(InstallerState.SELECT_PACKAGE);
    const [progress, setProgress] = useState(initialProgress);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    const onInstall = async (
        release: GithubRelease,
        firmwareType: FirmwareType = FirmwareType.WIFI
    ) => {
        console.log("Installing " + release.name + " with " + firmwareType);
        InstallService.installRelease(
            release,
            serialPort,
            firmwareType,
            setProgress,
            setState
        ).catch(setErrorMessage);
    };

    return (
        <>
            {state === InstallerState.SELECT_PACKAGE && (
                <Firmware onInstall={onInstall} />
            )}

            {(state === InstallerState.DOWNLOADING ||
                state === InstallerState.EXTRACTING ||
                state === InstallerState.FLASHING) && (
                <Progress progress={progress} status={state} />
            )}

            {state === InstallerState.DONE && <Done onContinue={onClose} />}
            {state === InstallerState.ERROR && (
                <div className="alert alert-danger">{errorMessage}</div>
            )}
        </>
    );
};

export default Installer;
