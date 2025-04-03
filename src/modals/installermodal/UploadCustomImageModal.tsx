import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "../../components/";
import { Button, Modal } from "react-bootstrap";
import {
    ControllerStatus,
    InstallService,
    InstallerState
} from "../../services";
import { Progress } from "../../panels";
import { FlashProgress } from "../../services/FlashService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
    faBan,
    faClose,
    faFile,
    faFileArrowUp,
    faFire
} from "@fortawesome/free-solid-svg-icons";
import BootloaderInfo from "../../panels/bootloaderinfo/BootloaderInfo";
import Log from "../../components/log/Log";
import { ControllerServiceContext } from "../../context/ControllerServiceContext";

const initialProgress: FlashProgress = {
    fileIndex: 0,
    fileCount: 1,
    fileName: "",
    fileProgress: 0
};

type UploadCustomImageModalProps = {
    onClose: () => void;
};

const UploadCustomImageModal = ({ onClose }: UploadCustomImageModalProps) => {
    const { t } = useTranslation();
    const [showLog, setShowLog] = useState<boolean>(false);
    const controllerService = useContext(ControllerServiceContext);
    const [state, setState] = useState(InstallerState.SELECT_PACKAGE);
    const [progress, setProgress] = useState<FlashProgress>(initialProgress);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [log, setLog] = useState("");
    const [currentFile, setCurrentFile] = useState<File | undefined>();
    const [currentFileData, setCurrentFileData] = useState<
        Uint8Array | undefined
    >();

    const onLogData = (data: string) => {
        setLog((l) => l + data);
        console.log(data);
    };

    const onUpload = async () => {
        return new Promise((resolve) => {
            const input = document.createElement("input");
            input.type = "file";
            input.multiple = false;
            input.accept = ".bin";

            // eslint-disable-next-line
            input.onchange = async (e: any) => {
                const files = e?.target?.files ?? [];
                if (files.length === 0) {
                    resolve(1);
                }

                for (const file of files) {
                    setCurrentFile(file);
                    setCurrentFileData(await getFileData(file));
                }
                resolve(1);
            };
            input.click();
        });
    };

    const getFileData = (file): Promise<Uint8Array> => {
        return new Promise((resolve) => {
            console.log("Uploading", file);
            const reader = new FileReader();
            reader.onload = (readerEvent) => {
                const content = readerEvent?.target?.result as ArrayBuffer;
                if (!content) {
                    return;
                }

                resolve(new Uint8Array(Buffer.from(content)));
            };
            reader.readAsArrayBuffer(file);
        });
    };

    const onInstall = async (fileData: Uint8Array) => {
        try {
            await controllerService?.disconnect(false);
        } catch (_error) {
            // never mind
        }

        let hasErrors = false;
        try {
            await InstallService.installImage(
                controllerService.serialPort,
                fileData,
                setProgress,
                setState,
                onLogData
            );
        } catch (error) {
            setErrorMessage(error);
            setState(InstallerState.ERROR);
            hasErrors = true;
        }

        try {
            const status = await controllerService?.connect();
            if (status !== ControllerStatus.CONNECTED) {
                setErrorMessage(t("modal.installer.error-reconnecting"));
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
                <>
                    <Modal.Body>
                        <h3>{t("modal.installer.select-image")}</h3>
                        <p>{t("modal.installer.select-image-description1")}</p>
                        <p>{t("modal.installer.select-image-description2")}</p>
                        {!currentFile && (
                            <Button onClick={onUpload}>
                                <FontAwesomeIcon
                                    icon={faFileArrowUp as IconDefinition}
                                    style={{ marginRight: "10px" }}
                                />
                                {t("modal.installer.select-image-button")}
                            </Button>
                        )}
                        {currentFile && (
                            <>
                                <p>
                                    <FontAwesomeIcon
                                        icon={faFile as IconDefinition}
                                        style={{ marginRight: "10px" }}
                                    />
                                    {currentFile.name}
                                </p>
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={onClose}>
                            <FontAwesomeIcon icon={faClose as IconDefinition} />{" "}
                            {t("modal.installer.cancel")}
                        </Button>
                        <Button
                            disabled={!currentFile}
                            variant={currentFile ? "success" : "secondary"}
                            onClick={() => onInstall(currentFileData)}
                        >
                            <FontAwesomeIcon
                                icon={faFire as IconDefinition}
                                style={{ marginRight: "8px" }}
                            />
                            {t("modal.installer.install")}
                        </Button>
                    </Modal.Footer>
                </>
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

export default UploadCustomImageModal;
