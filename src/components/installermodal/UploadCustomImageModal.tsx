import React, { useContext, useState } from "react";
import { Spinner } from "..";
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
    faFile,
    faFileArrowUp
} from "@fortawesome/free-solid-svg-icons";
import BootloaderInfo from "../../panels/bootloaderinfo/BootloaderInfo";
import Log from "../log/Log";
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
        await InstallService.installImage(
            controllerService.serialPort,
            fileData,
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
        <Modal centered show={true} size="lg">
            {state === InstallerState.SELECT_PACKAGE && (
                <>
                    <Modal.Body>
                        <h3>Select image</h3>
                        <p>
                            If you have downloaded a package manually you can
                            flash the image from here.
                        </p>
                        <p>
                            Select the <b>firmware.bin</b> file to flash the
                            controller with.
                        </p>
                        {!currentFile && (
                            <Button onClick={onUpload}>
                                <FontAwesomeIcon
                                    icon={faFileArrowUp as IconDefinition}
                                    style={{ marginRight: "10px" }}
                                />
                                Select firmware image
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
                            <>Close</>
                        </Button>
                        <Button
                            disabled={!currentFile}
                            variant={currentFile ? "success" : "secondary"}
                            onClick={() => onInstall(currentFileData)}
                        >
                            Install
                        </Button>
                    </Modal.Footer>
                </>
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
            {state === InstallerState.UPLOADING_FILES && (
                <Modal.Body>
                    <h3>Uploading files</h3>
                    <p>
                        Uploading files... <Spinner />
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

export default UploadCustomImageModal;
