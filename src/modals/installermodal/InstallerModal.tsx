import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Spinner } from "../../components";
import { Modal } from "react-bootstrap";
import {
    ControllerStatus,
    FirmwareChoice,
    FirmwareFile,
    GithubRelease,
    GithubReleaseManifest,
    GithubService,
    InstallService,
    InstallerState,
    validateSignature
} from "../../services";
import { Progress } from "../../panels";
import { FlashProgress } from "../../services/FlashService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import BootloaderInfo from "../../panels/bootloaderinfo/BootloaderInfo";
import Log from "../../components/log/Log";
import { ControllerServiceContext } from "../../context/ControllerServiceContext";
import ConfirmPage from "./ConfirmPage";
import useTrackEvent, {
    TrackAction,
    TrackCategory
} from "../../hooks/useTrackEvent";

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
    const { t } = useTranslation();
    const trackEvent = useTrackEvent();

    const onLogData = (data: string) => {
        setLog((l) => l + data);
        console.log(data);
    };

    const onInstall = async (baud: number, files: string[]) => {
        trackEvent(
            TrackCategory.Install,
            TrackAction.InstallClick,
            release.name +
                " - " +
                choice.name +
                " - " +
                files.join(",") +
                " - " +
                baud
        );

        try {
            await controllerService?.disconnect(false);
        } catch (error) {
            trackEvent(
                TrackCategory.Install,
                TrackAction.InstallFail,
                "Disconnect - " + error
            );
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
            setErrorMessage(error.toString());
            setState(InstallerState.ERROR);
            hasErrors = true;
            trackEvent(
                TrackCategory.Install,
                TrackAction.InstallFail,
                "Install choice - " + error
            );
        });

        try {
            const status = await controllerService?.connect();
            if (status !== ControllerStatus.CONNECTED) {
                setErrorMessage(t("modal.installer.error-reconnecting"));
                setState(InstallerState.ERROR);
                trackEvent(
                    TrackCategory.Install,
                    TrackAction.InstallFail,
                    "Reconnect"
                );
            }

            if (!hasErrors) {
                setState(InstallerState.UPLOADING_FILES);
            }

            await Promise.all(
                files.map((file) => {
                    const extraFile = manifest.files?.[file] as FirmwareFile;

                    if (!extraFile) {
                        return;
                    }

                    console.log(
                        t("modal.installer.uploading") + ": ",
                        extraFile
                    );
                    return GithubService.getExtraFile(release, extraFile)
                        .then((data) => {
                            validateSignature(extraFile.signature, data);
                            return data;
                        })
                        .then((data) =>
                            controllerService?.uploadFile(
                                extraFile["controller-path"],
                                Buffer.from(data)
                            )
                        );
                })
            );

            if (!hasErrors) {
                setState(InstallerState.DONE);
                trackEvent(
                    TrackCategory.Install,
                    TrackAction.InstallSuccess,
                    release.name +
                        " - " +
                        choice.name +
                        " - " +
                        files.join(",") +
                        " - " +
                        baud
                );
            }
        } catch (error) {
            setErrorMessage(error.toString());
            setState(InstallerState.ERROR);
            trackEvent(
                TrackCategory.Install,
                TrackAction.InstallFail,
                "Post install - " + error
            );
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
                    <h3>{t("modal.installer.downloading")}</h3>
                    <p>
                        {t("modal.installer.downloading-description")}{" "}
                        <Spinner />
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
                    <h3>{t("modal.installer.restarting")}</h3>
                    <p>
                        {t("modal.installer.restarting-description")}{" "}
                        <Spinner />
                    </p>
                    <Log show={showLog} onShow={setShowLog}>
                        {log}
                    </Log>
                </Modal.Body>
            )}
            {state === InstallerState.UPLOADING_FILES && (
                <Modal.Body>
                    <h3>{t("modal.installer.uploading-files")}</h3>
                    <p>
                        {t("modal.installer.uploading-files-description")}{" "}
                        <Spinner />
                    </p>
                    <Log show={showLog} onShow={setShowLog}>
                        {log}
                    </Log>
                </Modal.Body>
            )}
            {state === InstallerState.DONE && (
                <>
                    <Modal.Body>
                        <h3>{t("modal.installer.done")}</h3>
                        <p>{t("modal.installer.done-description")}</p>
                        <Log show={showLog} onShow={setShowLog}>
                            {log}
                        </Log>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={onClose}>
                            {t("modal.installer.continue")}
                        </Button>
                    </Modal.Footer>
                </>
            )}
            {state === InstallerState.ERROR && (
                <>
                    <Modal.Body>
                        <h3>{t("modal.installer.error")}</h3>
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
                            {t("modal.installer.close")}
                        </Button>
                    </Modal.Footer>
                </>
            )}
        </Modal>
    );
};

export default InstallerModal;
