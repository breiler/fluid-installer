// FileArray is a TS type
import React, { useEffect, useState } from "react";
import { SerialPort } from "../../utils/serialport/SerialPort";
import {
    ControllerService,
    ListFilesCommand,
    File
} from "../../services/ControllerService";
import { Button } from "../../components";
import xmodem from "../../utils/xmodem";
import { convertUint8ArrayToBinaryString } from "../../utils/utils";

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
        this.serialPort.write(convertUint8ArrayToBinaryString(data));
    }

    on(channel: string, listener: (data: Buffer) => void) {
        this.listeners.push(listener);
    }
}

const FileBrowser = ({ serialPort }: FileBrowserProps) => {
    const [files, setFiles] = useState<File[]>([]);
    const [controllerService, setControllerService] =
        useState<ControllerService>();
    const [working, setWorking] = useState(false);

    useEffect(() => {
        const service = new ControllerService(serialPort);
        setWorking(true);
        service.connect().then(async () => {
            await serialPort.write(String.fromCharCode(0x0c)); // CTRL-L Restting echo mode
            await serialPort.getNativeSerialPort();
            const listCommand = await service.send(new ListFilesCommand());
            setFiles(listCommand.getFiles());
            setWorking(false);
        });
        setControllerService(service);

        return () => {
            console.log("Disconnecting")
            service.disconnect();
        };
    }, [serialPort]);

    const onDownload = async (file: File) => {
        setWorking(true);
        if (!controllerService) {
            return;
        }

        const fileData = await controllerService.fetchFile(
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
        setWorking(false);
    };

    return (
        <div style={{ height: 300 }}>
            <ul className="list-group">
                {files.sort().map((file) => (
                    <li key={file.id} className="list-group-item">
                        <div className="d-flex w-100 ">
                            <div className="p-2 flex-grow-1">{file.name}</div>
                            <div className="p-2">{file.size} b</div>
                            <div className="p-2">
                                <Button onClick={() => onDownload(file)} disabled={working}>
                                    <>Download</>
                                </Button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileBrowser;
