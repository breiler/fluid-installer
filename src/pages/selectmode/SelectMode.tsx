import React, { useContext } from "react";
import Page from "../../model/Page";
import { InstallCard } from "../../components/installcard/InstallCard";
import "./SelectMode.scss";
import { TerminalCard } from "../../components/terminalcard/TerminalCard";
import { FileBrowserCard } from "../../components/filebrowsercard/FileBrowserCard";
import { ControllerServiceContext } from "../../context/ControllerServiceContext";
import { ControllerStatus } from "../../services/controllerservice/ControllerService";

type Props = {
    onSelect: (page: Page) => void;
};

const SelectMode = ({ onSelect }: Props) => {
    const controllerService = useContext(ControllerServiceContext);

    return (
        <div className="container text-center">
            <div className="row">
                <div className="col">
                    <InstallCard onClick={() => onSelect(Page.INSTALLER)} />
                </div>
                <div className="col">
                    <TerminalCard onClick={() => onSelect(Page.TERMINAL)} disabled={controllerService?.status !== ControllerStatus.CONNECTED} />
                </div>
                <div className="col">
                    <FileBrowserCard
                        onClick={() => onSelect(Page.FILEBROWSER)} disabled={controllerService?.status !== ControllerStatus.CONNECTED}
                    />
                </div>
            </div>
        </div>
    );
};

export default SelectMode;
