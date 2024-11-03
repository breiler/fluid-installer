import React, { useContext, useState } from "react";
import { Button, Spinner } from "../../components";
import { Modal } from "react-bootstrap";
import {
    ControllerStatus,
    FirmwareChoice,
    GithubRelease,
    GithubReleaseManifest,
    InstallService,
    InstallerState
} from "../../services";
import { Progress } from "../../panels";
import { FlashProgress } from "../../services/FlashService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import BootloaderInfo from "../../panels/bootloaderinfo/BootloaderInfo";
import Log from "../log/Log";
import { ControllerServiceContext } from "../../context/ControllerServiceContext";
import ConfirmPage from "./ConfirmPage";

type InstallerModalProps = {
    onClose: () => void;
    onCancel: () => void;
    release: GithubRelease;
    manifest: GithubReleaseManifest;
    choice: FirmwareChoice;
};

const initialProgress: FlashProgress = {
    fileIndex: 0,
    fileCount: 1,
    fileName: "",
    fileProgress: 0
};

const InstallerModal = ({
    onClose,
    onCancel,
    release,
    manifest,
    choice
}: InstallerModalProps) => {
    const [showLog, setShowLog] = useState<boolean>(false);
    const controllerService = useContext(ControllerServiceContext);
    const [state, setState] = useState(InstallerState.SELECT_PACKAGE);
    const [progress, setProgress] = useState<FlashProgress>(initialProgress);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [log, setLog] = useState("");

    const onLogData = (data: string) => {
        setLog((l) => l + data);
        console.log(data);
    };

    const onInstall = async (baud: number) => {
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
            onLogData,
            baud
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
        <Modal centered show={true} size="lg">
            {state === InstallerState.SELECT_PACKAGE && (
                <ConfirmPage
                    release={release}
                    choice={choice}
                    manifest={manifest}
                    onCancel={onCancel}
                    onInstall={onInstall}
                />
            )}
            {(state === InstallerState.DOWNLOADING ||
                state === InstallerState.CHECKING_SIGNATURES) && (
                <Modal.Body>
                    <h3>Downloading</h3>
                    <p>
                        Downloading package... <Spinner />
                    </p>
                    <Log show={showLog} onShow={setShowLog}>
                        {log}
                    </Log>
                </Modal.Body>
            )}

            {state === InstallerState.ENTER_FLASH_MODE && (
                <Modal.Body>
                    <BootloaderInfo />
                    <Log show={showLog} onShow={setShowLog}>
                        {log}
                    </Log>
                </Modal.Body>
            )}

            {state === InstallerState.FLASHING && (
                <Modal.Body>
                    <Progress progress={progress} status={state} />
                    <Log show={showLog} onShow={setShowLog}>
                        {log}
                    </Log>
                </Modal.Body>
            )}
            {state === InstallerState.RESTARTING && (
                <Modal.Body>
                    <h3>Restarting</h3>
                    <p>
                        Waiting for controller restart... <Spinner />
                    </p>
                    <Log show={showLog} onShow={setShowLog}>
                        {log}
                    </Log>
                </Modal.Body>
            )}
            {state === InstallerState.DONE && (
                <>
                    <Modal.Body>
                        <h3>Done</h3>
                        <p>
                            The controller has been successfully installed and
                            is ready to be used.
                        </p>
                        <Log show={showLog} onShow={setShowLog}>
                            {log}
                        </Log>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={onClose}>
                            <>Continue</>
                        </Button>
                    </Modal.Footer>
                </>
            )}
            {state === InstallerState.ERROR && (
                <>
                    <Modal.Body>
                        <h3>Error!</h3>
                        <div className="alert alert-danger">
                            <FontAwesomeIcon icon={faBan as IconDefinition} />{" "}
                            {errorMessage}
                        </div>
                        <Log show={showLog} onShow={setShowLog}>
                            {log}
                        </Log>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={onClose}>
                            <>Close</>
                        </Button>
                    </Modal.Footer>
                </>
            )}
        </Modal>
    );
};

export default InstallerModal;
