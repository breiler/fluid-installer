import React, { useContext, useState } from "react";

import Progress from "../../panels/progress/Progress";
import Done from "../../panels/done/Done";
import Firmware from "../../panels/firmware/Firmware";
import { FirmwareChoice, GithubRelease, GithubReleaseManifest, GithubService } from "../../services/GitHubService";
import { FirmwareType, InstallService, InstallerState } from "../../services/InstallService";
import { SerialPort } from "../../utils/serialport/SerialPort";
import { FlashProgress } from "../../services/FlashService";
import { SerialPortContext } from "../../context/SerialPortContext";

const initialProgress: FlashProgress = {
    fileIndex: 0,
    fileCount: 1,
    fileName: "",
    fileProgress: 0
};

type InstallerProps = {
    onClose: () => void;
};

const Installer = ({ onClose }: InstallerProps) => {
    const serialPort = useContext(SerialPortContext);
    const [state, setState] = useState(InstallerState.SELECT_PACKAGE);
    const [progress, setProgress] = useState(initialProgress);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    const onInstall = async (
        release: GithubRelease,
        manifest: GithubReleaseManifest,
        choice: FirmwareChoice
    ) => {
        console.log("Installing " + release.name + " with " + choice.name);
        InstallService.installChoice(
            release,
            serialPort!,
            manifest,
            choice,
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
                state === InstallerState.CHECKING_SIGNATURES ||
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
