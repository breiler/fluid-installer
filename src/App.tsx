import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
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
import WiFiSettings from "./pages/wifisettings/WiFiSettings";
import Calibrate from "./pages/calibrate/Calibrate";
import Footer from "./components/footer/Footer";
import { MatomoProvider, createInstance } from "@datapunt/matomo-tracker-react";
import Unsupported from "./panels/unsupported/Unsupported";
import LostConnectionModal from "./modals/lostconnectionmodal/LostConnectionModal";
import useControllerStatus from "./hooks/useControllerStatus";
import useTrackEvent, {
    TrackAction,
    TrackCategory
} from "./hooks/useTrackEvent";

const TrackStart = () => {
    const trackEvent = useTrackEvent();
    useEffect(() => {
        trackEvent(TrackCategory.Start, TrackAction.Start);
    }, [trackEvent]);
    return <></>;
};

const App = () => {
    const navigate = useNavigate();
    const instance = createInstance({
        urlBase: "https://matomo.bitpusher.se/",
        siteId: 2
    });

    const [controllerService, setControllerService] =
        useState<ControllerService>();

    const onCloseConnection = () => {
        setControllerService(undefined);
    };

    const controllerStatus = useControllerStatus(controllerService);

    return (
        <MatomoProvider value={instance}>
            <>
                <TrackStart />
                <ControllerServiceContext.Provider value={controllerService}>
                    <LostConnectionModal onClose={onCloseConnection} />
                    <Header />

                    <div className="container">
                        {(isSafari() || isFirefox()) && <Unsupported />}
                        {!isSafari() &&
                            !isFirefox() &&
                            (!controllerService ||
                                controllerStatus ===
                                    ControllerStatus.DISCONNECTED) && (
                                <Connection onConnect={setControllerService} />
                            )}
                        {!isSafari() &&
                            !isFirefox() &&
                            controllerService &&
                            controllerStatus !==
                                ControllerStatus.DISCONNECTED && (
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
                                                <Route
                                                    index
                                                    element={<Home />}
                                                />
                                                <Route
                                                    path="install"
                                                    element={
                                                        <Installer
                                                            onClose={() =>
                                                                navigate(
                                                                    Page.HOME
                                                                )
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
        </MatomoProvider>
    );
};

export default App;
