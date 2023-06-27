import React, { useContext, useEffect, useState } from "react";
import Page from "../../model/Page";
import "./SelectMode.scss";
import { TerminalCard } from "../../components/terminalcard/TerminalCard";
import { InstallCard } from "../../components/installcard/InstallCard";
import { FileBrowserCard } from "../../components/filebrowsercard/FileBrowserCard";
import { ControllerServiceContext } from "../../context/ControllerServiceContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Button } from "../../components";
import { ButtonType } from "../../components/button";
import { Stats } from "../../services/controllerservice/GetStatsCommand";

type Props = {
    onSelect: (page: Page) => void;
};

const SelectMode = ({ onSelect }: Props) => {
    const controllerService = useContext(ControllerServiceContext);
    const [stats, setStats] = useState<Stats>();

    useEffect(() => {
        if (!controllerService) return;
        controllerService.getStats().then(setStats);
    }, [controllerService])


    return (<>
        <div className="container text-center">
            <div className="row">
                <div className="col">
                    <InstallCard onClick={() => onSelect(Page.INSTALLER)} />
                </div>
                <div className="col">
                    <TerminalCard onClick={() => onSelect(Page.TERMINAL)} />
                </div>
                {stats?.version && <div className="col">
                    <FileBrowserCard
                        onClick={() => onSelect(Page.FILEBROWSER)}
                    />
                </div>}
            </div>
        </div>

    </>
    );
};

export default SelectMode;
