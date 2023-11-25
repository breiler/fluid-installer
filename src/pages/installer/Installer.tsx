import React, { useContext, useState } from "react";
import InstallerModal from "../../components/installermodal/InstallerModal";
import { ControllerServiceContext } from "../../context/ControllerServiceContext";
import Firmware from "../../panels/firmware/Firmware";
import { FlashProgress } from "../../services/FlashService";
import {
    FirmwareChoice,
    GithubRelease,
    GithubReleaseManifest
} from "../../services/GitHubService";
import { InstallService, InstallerState } from "../../services/InstallService";
import { ControllerStatus } from "../../services/controllerservice/ControllerService";
import usePageView from "../../hooks/usePageView";

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
    usePageView("Installer");
    const controllerService = useContext(ControllerServiceContext);
    const [state, setState] = useState(InstallerState.SELECT_PACKAGE);
    const [progress, setProgress] = useState<FlashProgress>(initialProgress);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [log, setLog] = useState("");

    const onLogData = (data: string) => {
        setLog((l) => l + data);
        console.log(data);
    };

    const onInstall = async (
        release: GithubRelease,
        manifest: GithubReleaseManifest,
        choice: FirmwareChoice
    ) => {
        try {
            await controllerService?.disconnect(false);
        } catch (error) {
            // never mind
        }

        let hasErrors = false;
        await InstallService.installChoice(
            release,
            controllerService!.serialPort!,
            manifest,
            choice,
            setProgress,
            setState,
            onLogData
        ).catch((error) => {
            setErrorMessage(error);
            setState(InstallerState.ERROR);
            hasErrors = true;
        });

        try {
            const status = await controllerService?.connect();
            if (status !== ControllerStatus.CONNECTED) {
                setErrorMessage(
                    "An error occured while reconnecting, please reboot the controller"
                );
                setState(InstallerState.ERROR);
            }

            if (!hasErrors) {
                setState(InstallerState.DONE);
            }
        } catch (error) {
            setErrorMessage(error);
            setState(InstallerState.ERROR);
        }
    };

    return (
        <>
            {state !== InstallerState.SELECT_PACKAGE && (
                <InstallerModal
                    log={log}
                    state={state}
                    errorMessage={errorMessage}
                    progress={progress}
                    onClose={onClose}
                />
            )}
            <Firmware onInstall={onInstall} />
        </>
    );
};

export default Installer;
