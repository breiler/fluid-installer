import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTerminal,
    faFolderOpen,
    faDownload
} from "@fortawesome/free-solid-svg-icons";

import { Button, Card } from "../../components";
import Page from "../../model/Page";
import { Version } from "../../panels/version/Version";
import { SerialPort } from "../../utils/serialport/SerialPort";
import "./SelectMode.scss";

type Props = {
    onSelect: (page: Page) => void;
    serialPort: SerialPort;
};

const SelectMode = ({ onSelect, serialPort }: Props) => {
    return (
        <div className="container text-center">
            <div className="row">
                <div className="col">
                    <Card className="select-card">
                        <Version serialPort={serialPort} />
                    </Card>
                </div>
                <div className="col">
                    <Card
                        className="select-card"
                        footer={
                            <Button onClick={() => onSelect(Page.INSTALLER)}>
                                <>Install FluidNC</>
                            </Button>
                        }>
                        <div className="select-icon">
                            <FontAwesomeIcon icon={faDownload} size="4x" />
                        </div>
                        <>Install or upgrade FluidNC on your controller</>
                    </Card>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Card
                        className="select-card"
                        footer={
                            <Button onClick={() => onSelect(Page.TERMINAL)}>
                                <>Open terminal</>
                            </Button>
                        }>
                        <div className="select-icon">
                            <FontAwesomeIcon icon={faTerminal} size="4x" />
                        </div>
                        <>Connect with your controller using a terminal</>
                    </Card>
                </div>
                <div className="col">
                    <Card
                        className="select-card"
                        footer={
                            <Button onClick={() => onSelect(Page.FILEBROWSER)}>
                                <>File browser</>
                            </Button>
                        }>
                        <div className="select-icon">
                            <FontAwesomeIcon icon={faFolderOpen} size="4x" />
                        </div>
                        <>Manage files on the controller</>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SelectMode;
