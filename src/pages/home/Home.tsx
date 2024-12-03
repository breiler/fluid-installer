import React, { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../../components/alertmessage/AlertMessage";
import { CalibrateCard } from "../../components/cards/calibratecard/CalibrateCard";
import { FileBrowserCard } from "../../components/cards/filebrowsercard/FileBrowserCard";
import { InstallCard } from "../../components/cards/installcard/InstallCard";
import { TerminalCard } from "../../components/cards/terminalcard/TerminalCard";
import { WiFiCard } from "../../components/cards/wificard/WiFiCard";
import LogModal from "../../components/logmodal/LogModal";
import PageTitle from "../../components/pagetitle/PageTitle";
import { ControllerServiceContext } from "../../context/ControllerServiceContext";
import usePageView from "../../hooks/usePageView";
import Page from "../../model/Page";
import { GetStartupShowCommand } from "../../services/controllerservice/commands/GetStartupShowCommand";
import {
    GetStatsCommand,
    Stats
} from "../../services/controllerservice/commands/GetStatsCommand";
import { sleep } from "../../utils/utils";
import "./Home.scss";
import { VersionCommand } from "../../services/controllerservice/commands/VersionCommand";
import SpinnerModal from "../../components/spinnermodal/SpinnerModal";

const Home = () => {
    usePageView("Home");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const controllerService = useContext(ControllerServiceContext);
    const [stats, setStats] = useState<Stats>();
    const [version, setVersion] = useState<string>();
    const [isBootError, setBootError] = useState<boolean>(false);
    const [showLogModal, setShowLogModal] = useState<boolean>(false);
    const [startupLogRows, setStartupLogRows] = useState<string[]>([]);

    const init = async () => {
        if (!controllerService) return;
        await sleep(1000);
        await controllerService
            .send(new GetStatsCommand(), 5000)
            .then((command) => setStats(command.getStats()))
            .catch((error) => {
                console.error("Got an error while fetching stats", error);
                throw "Got an error while fetching stats";
            });

        await controllerService
            .send(new VersionCommand(), 5000)
            .then((command) => setVersion(command.getVersionNumber()))
            .catch((error) => {
                console.error("Got an error while fetching version", error);
                throw "Got an error while fetching version";
            });

        await controllerService
            .send(new GetStartupShowCommand())
            .then((command) => {
                setBootError(
                    !!command.response.find(
                        (line) => line.indexOf("[MSG:ERR:") > -1
                    )
                );
                setStartupLogRows(command.response);
            })
            .catch((error) => {
                console.error(
                    "Got an error while checking startup messages",
                    error
                );
                throw "Got an error while checking startup messages";
            });

        return Promise.resolve();
    };

    useEffect(() => {
        if (!controllerService) return;
        setIsLoading(true);
        init().finally(() => setIsLoading(false));
    }, [controllerService]);

    return (
        <>
            <SpinnerModal show={isLoading} text="Loading..." />
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
                    {version && (
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
                    {version && (
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

export default Home;
