import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../../../components/alertmessage/AlertMessage";
import { CalibrateCard } from "../../../components/cards/calibratecard/CalibrateCard";
import { FileBrowserCard } from "../../../components/cards/filebrowsercard/FileBrowserCard";
import { InstallCard } from "../../../components/cards/installcard/InstallCard";
import { TerminalCard } from "../../../components/cards/terminalcard/TerminalCard";
import { WiFiCard } from "../../../components/cards/wificard/WiFiCard";
import LogModal from "../../../modals/logmodal/LogModal";
import PageTitle from "../../../components/pagetitle/PageTitle";
import { ControllerServiceContext } from "../../../context/ControllerServiceContext";
import usePageView from "../../../hooks/usePageView";
import Page from "../../../model/Page";
import { GetStartupShowCommand } from "../../../services/controllerservice/commands/GetStartupShowCommand";
import {
    GetStatsCommand,
    Stats
} from "../../../services/controllerservice/commands/GetStatsCommand";
import { sleep } from "../../../utils/utils";
import "./Home.scss";
import { VersionCommand } from "../../../services/controllerservice/commands/VersionCommand";
import SpinnerModal from "../../../modals/spinnermodal/SpinnerModal";

const Home = () => {
    usePageView("Home");
    const { t } = useTranslation();
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
                console.warn("Got an error while fetching stats", error);
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
            <PageTitle>{t("page.connection.title")}</PageTitle>
            <p>{t("page.home.description")}</p>
            <div className="container text-center select-mode">
                <Row>
                    <Col xs={12}>
                        {isBootError && (
                            <AlertMessage variant="danger">
                                {t("page.home.error-while-booting")}
                                <br />
                                <a
                                    href="#"
                                    onClick={() => setShowLogModal(true)}
                                >
                                    {t("page.home.show-details")}
                                </a>
                            </AlertMessage>
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={6} lg={4}>
                        <InstallCard
                            onClick={() => navigate(Page.FLUIDNC_INSTALLER)}
                        />
                    </Col>
                    <Col xs={12} md={6} lg={4}>
                        <TerminalCard
                            disabled={false}
                            onClick={() => navigate(Page.FLUIDNC_TERMINAL)}
                        />
                    </Col>
                    {version && (
                        <Col xs={12} md={6} lg={4}>
                            <FileBrowserCard
                                onClick={() =>
                                    navigate(Page.FLUIDNC_FILEBROWSER)
                                }
                            />
                        </Col>
                    )}
                    {stats?.version && (
                        <Col xs={12} md={6} lg={4}>
                            <WiFiCard
                                onClick={() => navigate(Page.FLUIDNC_WIFI)}
                                stats={stats}
                            />
                        </Col>
                    )}
                    {version && (
                        <Col xs={12} md={6} lg={4}>
                            <CalibrateCard
                                onClick={() => navigate(Page.FLUIDNC_CALIBRATE)}
                            />
                        </Col>
                    )}
                </Row>
            </div>
        </>
    );
};

export default Home;
