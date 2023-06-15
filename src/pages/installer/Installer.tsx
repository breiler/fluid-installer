import React, { useContext, useState } from "react";

import Progress from "../../panels/progress/Progress";
import Done from "../../panels/done/Done";
import Firmware from "../../panels/firmware/Firmware";
import { FirmwareChoice, GithubRelease, GithubReleaseManifest } from "../../services/GitHubService";
import { InstallService, InstallerState } from "../../services/InstallService";
import { FlashProgress } from "../../services/FlashService";
import { ControllerServiceContext } from "../../context/ControllerServiceContext";
import { ControllerStatus } from "../../services/controllerservice/ControllerService";
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
    const controllerService = useContext(ControllerServiceContext);
    const [state, setState] = useState(InstallerState.SELECT_PACKAGE);
    const [progress, setProgress] = useState(initialProgress);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    const onInstall = async (
        release: GithubRelease,
        manifest: GithubReleaseManifest,
        choice: FirmwareChoice
    ) => {
        console.log("Installing " + release.name + " with " + choice.name);
        try {
            await controllerService?.disconnect();
        } catch (error) {
            // never mind
        }

        await InstallService.installChoice(
            release,
            controllerService!.serialPort!,
            manifest,
            choice,
            setProgress,
            setState
        ).catch((error) => {
            setErrorMessage(error);
            setState(InstallerState.ERROR);
        });

        try {
            let status = await controllerService?.connect();
            if(status !== ControllerStatus.CONNECTED) {
                setErrorMessage("An error occured while reconnecting, please reboot the controller");
                setState(InstallerState.ERROR);
            }
            setState(InstallerState.DONE);
        } catch (error) {
            setErrorMessage(error);
            setState(InstallerState.ERROR);
        }
    };

    return (
        <>
            {state === InstallerState.SELECT_PACKAGE && (
                <Firmware onInstall={onInstall} />
            )}

            {(state === InstallerState.DOWNLOADING ||
                state === InstallerState.CHECKING_SIGNATURES ||
                state === InstallerState.FLASHING ||
                state === InstallerState.FLASH_DONE) && (
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
