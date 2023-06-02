import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTerminal, faFolderOpen } from "@fortawesome/free-solid-svg-icons";

import Page from "../../model/Page";
import { Button, Card } from "../../components";
import { SerialPort } from "../../utils/serialport/SerialPort";
import { InstallCard } from "../../components/installcard/InstallCard";
import "./SelectMode.scss";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type Props = {
    onSelect: (page: Page) => void;
    serialPort: SerialPort;
};

const SelectMode = ({ onSelect, serialPort }: Props) => {
    return (
        <div className="container text-center">
            <div className="row">
                <div className="col">
                    <InstallCard
                        onClick={() => onSelect(Page.INSTALLER)}
                        serialPort={serialPort}
                    />
                </div>
                <div className="col">
                    <Card
                        className="select-card"
                        footer={
                            <Button onClick={() => onSelect(Page.TERMINAL)}>
                                <>Open terminal</>
                            </Button>
                        }>
                        <div className="select-icon">
                            <FontAwesomeIcon icon={faTerminal as IconDefinition} size="4x" />
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
                            <FontAwesomeIcon icon={faFolderOpen as IconDefinition} size="4x" />
                        </div>
                        <>Manage files on the controller</>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SelectMode;
