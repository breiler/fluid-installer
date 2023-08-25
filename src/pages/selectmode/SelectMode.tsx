import React, { useContext, useEffect, useState } from "react";
import "./SelectMode.scss";
import { TerminalCard } from "../../components/terminalcard/TerminalCard";
import { InstallCard } from "../../components/installcard/InstallCard";
import { FileBrowserCard } from "../../components/filebrowsercard/FileBrowserCard";
import { ControllerServiceContext } from "../../context/ControllerServiceContext";
import { Stats } from "../../services/controllerservice/commands/GetStatsCommand";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../components/pagetitle/PageTitle";

const SelectMode = () => {
    const navigate = useNavigate();
    const controllerService = useContext(ControllerServiceContext);
    const [stats, setStats] = useState<Stats>();

    useEffect(() => {
        if (!controllerService) return;
        controllerService.getStats().then(setStats);
    }, [controllerService]);

    return (
        <>
            <PageTitle>FluidNC Web Installer</PageTitle>
            <p>You are now connected to a device, please choose an action below</p>
            <div className="container text-center select-mode">
                <div className="row">
                    <div className="col">
                        <InstallCard onClick={() => navigate("/install")} />
                    </div>
                    <div className="col">
                        <TerminalCard onClick={() => navigate("/terminal")} />
                    </div>
                    {stats?.version && (
                        <div className="col">
                            <FileBrowserCard
                                onClick={() => navigate("/filebrowser")}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SelectMode;
