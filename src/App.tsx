import React, { useMemo } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Header } from "./components";
import Page from "./model/Page";
import FileBrowser from "./pages/fluidnc/filebrowser";
import Home from "./pages/fluidnc/home";
import { isSafari, isFirefox } from "./utils/utils";

import WiFiSettings from "./pages/fluidnc/wifisettings/WiFiSettings";
import Calibrate from "./pages/fluidnc/calibrate/Calibrate";
import Footer from "./components/footer/Footer";
import Unsupported from "./panels/unsupported/Unsupported";

import MatomoTracker from "./components/matomotracker/MatomoTracker";
import FluidNCOutlet from "./outlets/FluidNCOutlet";
import SelectDevicePage from "./pages/selectdevice/SelectDevicePage";
import FluidDialOutlet from "./outlets/FluidDialOutlet";
import FluidDialHomePage from "./pages/fluiddial/home/HomePage";
import Installer from "./pages/fluidnc/installer";
import Terminal from "./pages/fluidnc/terminal";
import NotFoundPage from "./pages/notfound/NotFoundPage";
import { GithubService } from "./services";

const Root = () => {
    const navigate = useNavigate();
    const githubService = useMemo(() => new GithubService(), []);

    if (isSafari() || isFirefox()) {
        return <Unsupported />;
    }

    return (
        <Routes>
            <Route index element={<SelectDevicePage />} />
            <Route path={Page.FLUIDNC_HOME} element={<FluidNCOutlet />}>
                <Route index element={<Home />} />
                <Route
                    path={Page.FLUIDNC_INSTALLER}
                    element={
                        <Installer
                            onClose={() => navigate(Page.FLUIDNC_HOME)}
                            githubService={githubService}
                        />
                    }
                />
                <Route path={Page.FLUIDNC_TERMINAL} element={<Terminal />} />
                <Route
                    path={Page.FLUIDNC_FILEBROWSER}
                    element={<FileBrowser />}
                />
                <Route path={Page.FLUIDNC_WIFI} element={<WiFiSettings />} />
                <Route path={Page.FLUIDNC_CALIBRATE} element={<Calibrate />} />
            </Route>
            <Route path={Page.FLUID_DIAL_HOME} element={<FluidDialOutlet />}>
                <Route index element={<FluidDialHomePage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

const App = () => {
    return (
        <MatomoTracker>
            <Header />
            <Container>
                <Root />
            </Container>
            <Footer />
        </MatomoTracker>
    );
};

export default App;
