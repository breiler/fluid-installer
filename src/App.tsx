import React, { FunctionComponent, ReactNode, createElement, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faClose } from "@fortawesome/free-solid-svg-icons";

import { Header } from "./components";
import Page from "./model/Page";
import { Installer, Terminal } from "./pages";
import FileBrowser from "./pages/filebrowser";
import SelectMode from "./pages/selectmode";
import { Connection } from "./panels";
import { isSafari } from "./utils/utils";
import { ControllerService, ControllerStatus } from "./services";
import { ControllerServiceContext } from "./context/ControllerServiceContext";
import Navigation from "./panels/navigation/Navigation";
import { ReactElement } from "react-markdown/lib/react-markdown";


const App = () => {
    const navigate = useNavigate();

    if (isSafari()) {
        return <h1>This tool is not supported on Safari!</h1>;
    }
    const [controllerService, setControllerService] = useState<ControllerService>();
    const [controllerStatus, setControllerStatus] = useState<ControllerStatus>(ControllerStatus.DISCONNECTED);

    useEffect(() => {
        controllerService?.addListener((status) => {
            if (status === ControllerStatus.DISCONNECTED) {
                setControllerService(undefined);
            } else if (status === ControllerStatus.CONNECTION_LOST) {
                setControllerStatus(status);
            }
        });
    }, [controllerService])

    return (
        <>
            <Modal show={controllerStatus === ControllerStatus.CONNECTION_LOST} size="sm" scrollable={true} centered={false}>
                <Modal.Body>
                    Lost the connection to the controller
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => { setControllerService(undefined); setControllerStatus(ControllerStatus.DISCONNECTED); }}>
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

                    {!controllerService && <Connection onConnect={setControllerService} />}

                    {controllerService &&
                        <Container>
                            <Row>
                                <Col xs={3}><Navigation /></Col>
                                <Col xs={9}>
                                    <Routes>
                                        <Route index element={<SelectMode />} />
                                        <Route path="install" element={<Installer onClose={() => navigate(Page.HOME)} />} />
                                        <Route path="terminal" element={<Terminal onClose={() => navigate(Page.HOME)} />} />
                                        <Route path="files" element={<FileBrowser />} />
                                    </Routes>
                                </Col>
                            </Row>
                        </Container>
                    }
                </div>
            </ControllerServiceContext.Provider >
        </>
    );
};

export default App;
