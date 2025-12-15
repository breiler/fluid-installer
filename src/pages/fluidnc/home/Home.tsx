import React, { useContext, useState } from "react";
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
import "./Home.scss";

const Home = () => {
    usePageView("Home");
    const { t } = useTranslation();
    const navigate = useNavigate();
    const controllerService = useContext(ControllerServiceContext);
    const [showLogModal, setShowLogModal] = useState<boolean>(false);

    return (
        <>
            <LogModal
                show={showLogModal}
                setShow={setShowLogModal}
                rows={controllerService.startupLines}
            />
            <PageTitle>{t("page.connection.title")}</PageTitle>
            <p>{t("page.home.description")}</p>
            <div className="container text-center select-mode">
                <Row>
                    <Col xs={12}>
                        {controllerService.hasErrors && (
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
                        {controllerService.looping && (
                            <AlertMessage variant="danger">
                                Controller is in a reset loop
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
                    {controllerService.version !== "?" && (
                        <Col xs={12} md={6} lg={4}>
                            <FileBrowserCard
                                onClick={() =>
                                    navigate(Page.FLUIDNC_FILEBROWSER)
                                }
                            />
                        </Col>
                    )}
                    {controllerService.version !== "?" && (
                        <Col xs={12} md={6} lg={4}>
                            <CalibrateCard
                                onClick={() => navigate(Page.FLUIDNC_CALIBRATE)}
                            />
                        </Col>
                    )}
                    {controllerService.hasWiFi && (
                        <Col xs={12} md={6} lg={4}>
                            <WiFiCard
                                onClick={() => navigate(Page.FLUIDNC_WIFI)}
                            />
                        </Col>
                    )}
                    {/* false && (
                    <Col xs={12} md={6} lg={4}>
                        <LogModal
                            show={showLogModal}
                            setShow={setShowLogModal}
                            rows={controllerService.startupLines}
                        />
                    </Col>
                    )*/}
                </Row>
            </div>
        </>
    );
};

export default Home;
