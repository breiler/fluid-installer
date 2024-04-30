import React, { useContext, useEffect, useState } from "react";
import "./SelectMode.scss";
import { TerminalCard } from "../../components/cards/terminalcard/TerminalCard";
import { InstallCard } from "../../components/cards/installcard/InstallCard";
import { FileBrowserCard } from "../../components/cards/filebrowsercard/FileBrowserCard";
import { ControllerServiceContext } from "../../context/ControllerServiceContext";
import { Stats } from "../../services/controllerservice/commands/GetStatsCommand";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../components/pagetitle/PageTitle";
import Page from "../../model/Page";
import usePageView from "../../hooks/usePageView";
import { WiFiCard } from "../../components/cards/wificard/WiFiCard";
import { Col } from "react-bootstrap";

const SelectMode = () => {
    usePageView("Home");
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
            <p>
                You are now connected to a device, please choose an action below
            </p>
            <div className="container text-center select-mode">
                <div className="row">
                    <Col xs={12} md={6} lg={4}>
                        <InstallCard onClick={() => navigate(Page.INSTALLER)} />
                    </Col>
                    <Col xs={12} md={6} lg={4}>
                        <TerminalCard
                            disabled={false}
                            onClick={() => navigate(Page.TERMINAL)}
                        />
                    </Col>
                    {stats?.version && (
                        <Col xs={12} md={6} lg={4}>
                            <FileBrowserCard
                                onClick={() => navigate(Page.FILEBROWSER)}
                            />
                        </Col>
                    )}
                    {stats?.version && (
                        <Col xs={12} md={6} lg={4}>
                            <WiFiCard onClick={() => navigate(Page.WIFI)} />
                        </Col>
                    )}
                </div>
            </div>
        </>
    );
};

export default SelectMode;
