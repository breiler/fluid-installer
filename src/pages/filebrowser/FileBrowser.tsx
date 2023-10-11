import React, { useContext, useEffect, useState } from "react";
import { Buffer } from "buffer";
import {
    ListFilesCommand,
    ControllerFile,
    DeleteFileCommand,
    GetConfigFilenameCommand,
    SetConfigFilenameCommand
} from "../../services/controllerservice";
import { Button } from "../../components";
import { Alert, ToggleButton } from "react-bootstrap";
import {
    faTrash,
    faFile,
    faFileLines,
    faFileImage,
    faFileZipper,
    faPen,
    faUpload
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import EditorModal from "../../components/editormodal/EditorModal";
import SpinnerModal from "../../components/spinnermodal/SpinnerModal";
import { ControllerServiceContext } from "../../context/ControllerServiceContext";
import PageTitle from "../../components/pagetitle/PageTitle";
import usePageView from "../../hooks/usePageView";

type EditFile = {
    file: ControllerFile;
    fileData: Buffer;
};

const fileUpload = (file, onSave) => {
    return new Promise((resolve) => {
        console.log("Uploading", file);
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
            const content = readerEvent?.target?.result as ArrayBuffer;
            if (!content) {
                return;
            }

            onSave(file, Buffer.from(content)).finally(() => resolve(1));
        };
        reader.readAsArrayBuffer(file);
    });
};

const FileBrowser = () => {
    usePageView("File browser");
    const controllerService = useContext(ControllerServiceContext);
    const [files, setFiles] = useState<ControllerFile[]>([]);
    const [configFilename, setConfigFilename] = useState<string>("");
    const [editFile, setEditFile] = useState<EditFile | undefined>();
    const [uploadError, setUploadError] = useState<string | undefined>();

    const [isDownloading, setIsDownloading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [currentFileName, setCurrentFileName] = useState("");

    useEffect(() => {
        if (!controllerService) {
            return;
        }

        controllerService.connect().then(async () => {
            await controllerService.serialPort.write(Buffer.from([0x0c])); // CTRL-L Restting echo mode
            const listCommand = await controllerService.send(
                new ListFilesCommand()
            );
            setFiles(listCommand.getFiles());

            setConfigFilename(
                await (
                    await controllerService.send(new GetConfigFilenameCommand())
                ).getFilename()
            );
        });
    }, [controllerService]);

    const refreshFileList = async (): Promise<void> => {
        if (!controllerService) {
            return Promise.resolve();
        }

        return controllerService
            .send(new ListFilesCommand())
            .then((listCommand) => {
                setFiles(listCommand.getFiles());
            });
    };

    const onDelete = async (file: ControllerFile) => {
        if (!controllerService) {
            return;
        }

        await controllerService.send(new DeleteFileCommand(file.name));
        await refreshFileList();
    };

    const onDownload = async (file: ControllerFile) => {
        if (!controllerService) {
            return;
        }
        setIsDownloading(true);

        try {
            const fileData = await controllerService.downloadFile(
                "/littlefs/" + file.name
            );
            const fileBlob = new Blob([fileData], {
                type: "application/octet-binary;charset=utf-8"
            });
            const a = document.createElement("a"),
                url = URL.createObjectURL(fileBlob);
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
        } finally {
            setIsDownloading(false);
        }
    };

    const onEdit = async (file: ControllerFile) => {
        if (!controllerService) {
            return;
        }

        setIsDownloading(true);
        controllerService
            .downloadFile("/littlefs/" + file.name)
            .then((fileData) => {
                setEditFile({ file, fileData });
            })
            .finally(() => {
                setIsDownloading(false);
            });
    };

    const onCreateConfig = async () => {
        if (!controllerService) {
            return;
        }

        setEditFile({
            file: { id: configFilename, name: configFilename, size: 0 },
            fileData: Buffer.from("name: New configuration")
        });
    };

    const onUpload = async () => {
        return new Promise((resolve) => {
            const input = document.createElement("input");
            input.type = "file";
            input.multiple = true;
            input.onchange = async (e: any) => {
                setIsUploading(true);
                const files = e?.target?.files ?? [];
                if (files.length === 0) {
                    resolve(1);
                }

                for (const file of files) {
                    setCurrentFileName(file.name);
                    await fileUpload(file, onSave);
                }
                resolve(1);
            };
            input.click();
        }).finally(() => {
            setIsUploading(false);
            setCurrentFileName("");
        });
    };

    const onSave = async (file: ControllerFile, fileData: Buffer) => {
        return await controllerService
            ?.uploadFile("/littlefs/" + file.name, fileData)
            .then(async () => await refreshFileList())
            .catch((error) => setUploadError(error));
    };

    const onChangeConfig = async (fileName: string) => {
        await await controllerService?.send(
            new SetConfigFilenameCommand(fileName)
        );
        setConfigFilename(
            await (
                await controllerService!.send(new GetConfigFilenameCommand())
            ).getFilename()
        );
    };

    return (
        <>
            <PageTitle>File browser</PageTitle>
            <SpinnerModal show={isDownloading} text="Downloading..." />
            <SpinnerModal
                show={isUploading}
                text={"Uploading " + currentFileName + "..."}
            />

            {editFile && (
                <EditorModal
                    file={editFile?.file}
                    fileData={editFile?.fileData}
                    onSave={onSave}
                    onClose={() => setEditFile(undefined)}
                />
            )}

            {configFilename &&
                !files.find((file) => file.name === configFilename) && (
                    <>
                        <Alert variant="warning">
                            The configuration file{" "}
                            <strong>{configFilename}</strong> is missing, do you
                            want to create it?
                            <br />
                            <br />
                            <Button onClick={onCreateConfig}>
                                <>Create config</>
                            </Button>
                        </Alert>
                    </>
                )}

            <div style={{ height: 300 }}>
                <ul className="list-group">
                    {files.sort().map((file) => {
                        let icon = faFile as IconDefinition;
                        if (
                            file.name.endsWith(".yaml") ||
                            file.name.endsWith(".yml")
                        ) {
                            icon = faFileLines as IconDefinition;
                        } else if (
                            file.name.endsWith(".jpeg") ||
                            file.name.endsWith(".jpg") ||
                            file.name.endsWith(".gif") ||
                            file.name.endsWith(".png")
                        ) {
                            icon = faFileImage as IconDefinition;
                        } else if (
                            file.name.endsWith(".gz") ||
                            file.name.endsWith(".zip")
                        ) {
                            icon = faFileZipper as IconDefinition;
                        }

                        return (
                            <li key={file.id} className="list-group-item">
                                <div className="d-flex w-100">
                                    <div className="p-2 flex-grow-1 align-self-center">
                                        <a
                                            title={"Download " + file.name}
                                            style={{ textDecoration: "none" }}
                                            className="align-self-center"
                                            href="#"
                                            onClick={() => onDownload(file)}
                                            aria-disabled={isDownloading}
                                        >
                                            <div className="align-middle">
                                                <FontAwesomeIcon
                                                    style={{
                                                        verticalAlign: "middle",
                                                        marginRight: "8px"
                                                    }}
                                                    icon={icon}
                                                    size="2x"
                                                />
                                                <span className="align-middle">
                                                    {file.name}
                                                </span>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="p-2 align-self-center">
                                        {file.size} b
                                    </div>
                                    <div
                                        className="align-self-center"
                                        style={{
                                            minWidth: "44px",
                                            marginLeft: "8px",
                                            marginRight: "10px"
                                        }}
                                    >
                                        <Button
                                            title={"Delete " + file.name}
                                            style={{ marginRight: "0px" }}
                                            disabled={isDownloading}
                                            buttonType={"btn-danger"}
                                            onClick={() => onDelete(file)}
                                        >
                                            <>
                                                <FontAwesomeIcon
                                                    icon={
                                                        faTrash as IconDefinition
                                                    }
                                                    size="xs"
                                                />
                                            </>
                                        </Button>
                                    </div>
                                    <div
                                        className="align-self-center"
                                        style={{ minWidth: "60px" }}
                                    >
                                        {(file.name.endsWith(".yml") ||
                                            file.name.endsWith(".yaml")) && (
                                            <Button
                                                disabled={isDownloading}
                                                title={"Edit " + file.name}
                                                onClick={() => onEdit(file)}
                                            >
                                                <>
                                                    <FontAwesomeIcon
                                                        icon={
                                                            faPen as IconDefinition
                                                        }
                                                        size="xs"
                                                    />
                                                </>
                                            </Button>
                                        )}
                                    </div>
                                    <div
                                        className="align-self-center"
                                        style={{ minWidth: "130px" }}
                                    >
                                        {(file.name.endsWith(".yml") ||
                                            file.name.endsWith(".yaml")) && (
                                            <ToggleButton
                                                id={"select-file-" + file.name}
                                                type="checkbox"
                                                variant="outline-primary"
                                                title="Select as config"
                                                checked={
                                                    file.name === configFilename
                                                }
                                                value={file.name}
                                                onChange={(event) =>
                                                    onChangeConfig(
                                                        event.target.value
                                                    )
                                                }
                                            >
                                                {file.name ===
                                                    configFilename && (
                                                    <>Active config</>
                                                )}
                                                {file.name !==
                                                    configFilename && (
                                                    <>Select config</>
                                                )}
                                            </ToggleButton>
                                        )}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>

                {uploadError && (
                    <Alert
                        variant="danger"
                        onClose={() => setUploadError(undefined)}
                        dismissible
                        style={{ marginTop: "16px" }}
                    >
                        {uploadError}
                    </Alert>
                )}

                <div
                    className="d-flex justify-content-end"
                    style={{ marginTop: "16px" }}
                >
                    <Button
                        onClick={() => onUpload()}
                        style={{ marginRight: "0px" }}
                    >
                        <>
                            <FontAwesomeIcon
                                icon={faUpload as IconDefinition}
                                size="xs"
                            />{" "}
                            Upload
                        </>
                    </Button>
                </div>
            </div>
        </>
    );
};

export default FileBrowser;
