import React, { useContext, useEffect, useState } from "react";
import "./SelectMode.scss";
import { TerminalCard } from "../../components/cards/terminalcard/TerminalCard";
import { InstallCard } from "../../components/cards/installcard/InstallCard";
import { FileBrowserCard } from "../../components/cards/filebrowsercard/FileBrowserCard";
import { ControllerServiceContext } from "../../context/ControllerServiceContext";
import {
    GetStatsCommand,
    Stats
} from "../../services/controllerservice/commands/GetStatsCommand";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../components/pagetitle/PageTitle";
import Page from "../../model/Page";
import usePageView from "../../hooks/usePageView";
import { WiFiCard } from "../../components/cards/wificard/WiFiCard";
import { Col, Row } from "react-bootstrap";
import { sleep } from "../../utils/utils";
import { Spinner } from "../../components";
import { GetStartupShowCommand } from "../../services/controllerservice/commands/GetStartupShowCommand";
import AlertMessage from "../../components/alertmessage/AlertMessage";
import LogModal from "../../components/logmodal/LogModal";
import { CalibrateCard } from "../../components/cards/calibratecard/CalibrateCard";

const SelectMode = () => {
    usePageView("Home");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const controllerService = useContext(ControllerServiceContext);
    const [stats, setStats] = useState<Stats>();
    const [isBootError, setBootError] = useState<boolean>(false);
    const [showLogModal, setShowLogModal] = useState<boolean>(false);
    const [startupLogRows, setStartupLogRows] = useState<string[]>([]);

    useEffect(() => {
        if (!controllerService) return;
        setIsLoading(true);
        sleep(1000)
            .then(() => controllerService.send(new GetStatsCommand(), 5000))
            .then((command) => setStats(command.getStats()))
            .then(() => controllerService.send(new GetStartupShowCommand()))
            .then((command) => {
                setBootError(
                    !!command.response.find(
                        (line) => line.indexOf("[MSG:ERR:") > -1
                    )
                );
                setStartupLogRows(command.response);
            })
            .finally(() => setIsLoading(false));
    }, [controllerService]);

    if (isLoading) {
        return (
            <>
                <PageTitle>FluidNC Web Installer</PageTitle>
                <p>
                    Loading configuration <Spinner />
                </p>
            </>
        );
    }

    return (
        <>
            <LogModal
                show={showLogModal}
                setShow={setShowLogModal}
                rows={startupLogRows}
            />
            <PageTitle>FluidNC Web Installer</PageTitle>
            <p>
                You are now connected to a device, please choose an action below
            </p>
            <div className="container text-center select-mode">
                <Row>
                    <Col xs={12}>
                        {isBootError && (
                            <AlertMessage variant="danger">
                                There was an error during boot, likely due to an
                                unvalid configuration.
                                <br />
                                <a
                                    href="#"
                                    onClick={() => setShowLogModal(true)}
                                >
                                    Click here to see details
                                </a>
                            </AlertMessage>
                        )}
                    </Col>
                </Row>
                <Row>
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
                            <WiFiCard
                                onClick={() => navigate(Page.WIFI)}
                                stats={stats}
                            />
                        </Col>
                    )}
                    {stats?.version && (
                        <Col xs={12} md={6} lg={4}>
                            <CalibrateCard
                                onClick={() => navigate(Page.CALIBRATE)}
                            />
                        </Col>
                    )}
                </Row>
            </div>
        </>
    );
};

export default SelectMode;
