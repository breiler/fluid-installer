import React, { useEffect, useState } from "react";
import { SerialPort } from "../../utils/serialport/SerialPort";
import {
    ControllerService,
    ListFilesCommand,
    File,
    DeleteFileCommand
} from "../../services/ControllerService";
import { Button, Spinner } from "../../components";
import { Modal } from "react-bootstrap";
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
import CodeMirror from "@uiw/react-codemirror";

import { yaml } from "@codemirror/legacy-modes/mode/yaml";
import { StreamLanguage } from "@codemirror/language";
import EditorModal from "../../components/editormodal/EditorModal";

type FileBrowserProps = {
    serialPort: SerialPort;
};

class SocketAdapter {
    serialPort: SerialPort;
    listeners: ((data: Buffer) => void)[] = [];

    constructor(serialPort: SerialPort) {
        this.serialPort = serialPort;

        this.serialPort.addReader((data) => {
            this.listeners.forEach((listener) => listener(Buffer.from(data)));
        });
    }

    write(data: Buffer) {
        this.serialPort.write(data);
    }

    on(channel: string, listener: (data: Buffer) => void) {
        this.listeners.push(listener);
    }
}

type EditFile = {
    file: File;
    fileData: Buffer;
};

const FileBrowser = ({ serialPort }: FileBrowserProps) => {
    const [files, setFiles] = useState<File[]>([]);
    const [editFile, setEditFile] = useState<EditFile | undefined>();

    const [controllerService, setControllerService] =
        useState<ControllerService>();
    const [working, setWorking] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const service = new ControllerService(serialPort);
        setWorking(false);
        service.connect().then(async () => {
            await serialPort.write(Buffer.from([0x0c])); // CTRL-L Restting echo mode
            await serialPort.getNativeSerialPort();
            const listCommand = await service.send(new ListFilesCommand());
            setFiles(listCommand.getFiles());
        });
        setControllerService(service);

        return () => {
            console.log("Disconnecting...");
            service.disconnect();
        };
    }, [serialPort]);

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

    const onDelete = async (file: File) => {
        if (!controllerService) {
            return;
        }

        await controllerService.send(new DeleteFileCommand(file.name));
        await refreshFileList();
    };

    const onDownload = async (file: File) => {
        if (!controllerService) {
            return;
        }
        setWorking(true);

        try {
            const fileData = await controllerService.downloadFile(
                "/littlefs/" + file.name
            );
            var fileBlob = new Blob([fileData], {
                type: "application/octet-binary;charset=utf-8"
            });
            var a = document.createElement("a"),
                url = URL.createObjectURL(fileBlob);
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
        } finally {
            setWorking(false);
        }
    };

    const onEdit = async (file: File) => {
        if (!controllerService) {
            return;
        }

        setWorking(true);
        const fileData = await controllerService.downloadFile(
            "/littlefs/" + file.name
        );
        setWorking(false);
        setEditFile({ file, fileData });
    };

    const onUpload = async () => {
        const input = document.createElement("input");
        input.type = "file";
        input.onchange = (e: any) => {
            const file = e?.target?.files?.[0];
            if (!file) {
                setIsUploading(false);
                return;
            }

            const reader = new FileReader();
            reader.onload = (readerEvent) => {
                var content = readerEvent?.target?.result as ArrayBuffer;
                if (!content) {
                    setIsUploading(false);
                    return;
                }

                setIsUploading(true);
                controllerService
                    ?.uploadFile(file.name, Buffer.from(content))
                    .then(async () => {
                        await refreshFileList();
                        setIsUploading(false);
                    })
                    .finally(() => setIsUploading(false));
            };
            reader.readAsArrayBuffer(file);
        };
        input.click();
    };

    const onSave = async (file: File, fileData: Buffer) => {
        return await controllerService
            ?.uploadFile(file.name, fileData)
            .then(async () => {
                await new Promise(r => setTimeout(r, 2000))
                await refreshFileList();
            });
    };

    return (
        <>
            <Modal show={working} centered>
                <Modal.Body>
                    Downloading... <Spinner />
                </Modal.Body>
            </Modal>

            <Modal show={isUploading} centered>
                <Modal.Body>
                    Uploading... <Spinner />
                </Modal.Body>
            </Modal>

            <EditorModal
                file={editFile?.file}
                fileData={editFile?.fileData}
                onSave={onSave}
                onClose={() => setEditFile(undefined)}
            />

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
                                            aria-disabled={working}>
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
                                        }}>
                                        <Button
                                            title={"Delete " + file.name}
                                            style={{ marginRight: "0px" }}
                                            disabled={working}
                                            buttonType={"btn-danger"}
                                            onClick={() => onDelete(file)}>
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
                                        style={{ minWidth: "44px" }}>
                                        {(file.name.endsWith(".yml") ||
                                            file.name.endsWith(".yaml")) && (
                                            <Button
                                                disabled={working}
                                                style={{ marginRight: "0px" }}
                                                title={"Edit " + file.name}
                                                onClick={() => onEdit(file)}>
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
                                </div>
                            </li>
                        );
                    })}
                </ul>

                <div
                    className="d-flex justify-content-end"
                    style={{ marginTop: "16px" }}>
                    <Button
                        onClick={() => onUpload()}
                        style={{ marginRight: "0px" }}>
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
