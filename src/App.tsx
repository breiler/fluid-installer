import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faClose } from "@fortawesome/free-solid-svg-icons";

import { Header } from "./components";
import Page from "./model/Page";
import { Installer, Terminal } from "./pages";
import FileBrowser from "./pages/filebrowser";
import Home from "./pages/home";
import { Connection } from "./panels";
import { isSafari, isFirefox } from "./utils/utils";
import { ControllerService, ControllerStatus } from "./services";
import { ControllerServiceContext } from "./context/ControllerServiceContext";
import Navigation from "./panels/navigation/Navigation";
import PageTitle from "./components/pagetitle/PageTitle";
import WiFiSettings from "./pages/wifisettings/WiFiSettings";
import Calibrate from "./pages/calibrate/Calibrate";
import Footer from "./components/footer/Footer";
import { useTranslation } from "react-i18next";

const App = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [controllerService, setControllerService] =
        useState<ControllerService>();
    const [controllerStatus, setControllerStatus] = useState<ControllerStatus>(
        ControllerStatus.DISCONNECTED
    );

    useEffect(() => {
        controllerService?.addListener((status) => {
            if (status === ControllerStatus.DISCONNECTED) {
                setControllerService(undefined);
            } else if (status === ControllerStatus.CONNECTION_LOST) {
                setControllerStatus(status);
            }
        });
    }, [controllerService]);

    return (
        <>
            <Modal
                show={controllerStatus === ControllerStatus.CONNECTION_LOST}
                size="sm"
                scrollable={true}
                centered={false}
            >
                <Modal.Body>
                    {t("Lost the connection to the controller")}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => {
                            setControllerService(undefined);
                            setControllerStatus(ControllerStatus.DISCONNECTED);
                        }}
                    >
                        <>
                            <FontAwesomeIcon icon={faClose as IconDefinition} />{" "}
                            Close
                        </>
                    </Button>
                </Modal.Footer>
            </Modal>

            <ControllerServiceContext.Provider value={controllerService}>
                <Header />

                <div className="container">
                    {isSafari() ||
                        (isFirefox() && (
                            <>
                                <PageTitle>Browser not supported</PageTitle>
                                <p>Please use Chrome, Edge or Opera instead</p>
                            </>
                        ))}
                    {!isSafari() && !isFirefox() && !controllerService && (
                        <Connection onConnect={setControllerService} />
                    )}
                    {!isSafari() && !isFirefox() && controllerService && (
                        <Container>
                            <Row>
                                <Col sm={5} md={4} lg={3}>
                                    <Navigation />
                                </Col>
                                <Col
                                    sm={7}
                                    md={8}
                                    lg={9}
                                    style={{ marginTop: "32px" }}
                                >
                                    <Routes>
                                        <Route index element={<Home />} />
                                        <Route
                                            path="install"
                                            element={
                                                <Installer
                                                    onClose={() =>
                                                        navigate(Page.HOME)
                                                    }
                                                />
                                            }
                                        />
                                        <Route
                                            path="terminal"
                                            element={<Terminal />}
                                        />
                                        <Route
                                            path="files"
                                            element={<FileBrowser />}
                                        />
                                        <Route
                                            path="wifi"
                                            element={<WiFiSettings />}
                                        />
                                        <Route
                                            path="calibrate"
                                            element={<Calibrate />}
                                        />
                                    </Routes>
                                </Col>
                            </Row>
                        </Container>
                    )}
                </div>
                <Footer />
            </ControllerServiceContext.Provider>
        </>
    );
};

export default App;
