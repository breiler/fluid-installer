import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
    faDownload,
    faFolderOpen,
    faHome,
    faPowerOff,
    faRightFromBracket,
    faSliders,
    faTerminal,
    faWifi
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Nav } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { ControllerServiceContext } from "../../context/ControllerServiceContext";
import "./Navigation.scss";
import { Stats } from "../../services/controllerservice/commands/GetStatsCommand";
import RestartModal from "../../modals/restartmodal/RestartModal";
import Page from "../../model/Page";
import { VersionCommand } from "../../services/controllerservice/commands/VersionCommand";
import useTrackEvent, {
    TrackAction,
    TrackCategory
} from "../../hooks/useTrackEvent";

const Navigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const trackEvent = useTrackEvent();

    const controllerService = useContext(ControllerServiceContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [stats, setStats] = useState<Stats>();
    const [version, setVersion] = useState<string>();

    useEffect(() => {
        if (!controllerService) return;
        controllerService.getStats().then(setStats);
        controllerService
            .send(new VersionCommand(), 5000)
            .then((command) => setVersion(command.result()));
    }, [controllerService]);

    const restart = () => {
        trackEvent(TrackCategory.Restart, TrackAction.RestartClick);
        setIsLoading(true);
        controllerService?.hardReset().finally(() => setIsLoading(false));
    };

    const disconnect = () => {
        trackEvent(TrackCategory.Disconnect, TrackAction.DisconnectClick);
        controllerService?.disconnect(true);
    };

    const handleSelect = (eventKey) => {
        navigate(eventKey);
    };

    return (
        <>
            <RestartModal show={isLoading} />
            <Nav
                variant="pills"
                activeKey={location.pathname}
                defaultActiveKey="install"
                className="flex-column navigation-container"
                onSelect={handleSelect}
            >
                <Nav.Link eventKey={Page.FLUIDNC_HOME}>
                    <FontAwesomeIcon icon={faHome as IconDefinition} />{" "}
                    {t("panel.navigation.home")}
                </Nav.Link>
                <Nav.Link eventKey={Page.FLUIDNC_INSTALLER}>
                    <FontAwesomeIcon icon={faDownload as IconDefinition} />{" "}
                    {t("panel.navigation.install")}
                </Nav.Link>
                <Nav.Link eventKey={Page.FLUIDNC_TERMINAL}>
                    <FontAwesomeIcon icon={faTerminal as IconDefinition} />{" "}
                    {t("panel.navigation.terminal")}
                </Nav.Link>
                {version && (
                    <Nav.Link eventKey={Page.FLUIDNC_FILEBROWSER}>
                        <FontAwesomeIcon
                            icon={faFolderOpen as IconDefinition}
                        />{" "}
                        {t("panel.navigation.file-browser")}
                    </Nav.Link>
                )}
                {stats?.version && (
                    <Nav.Link eventKey={Page.FLUIDNC_WIFI}>
                        <FontAwesomeIcon icon={faWifi as IconDefinition} />{" "}
                        {t("panel.navigation.wifi")}
                    </Nav.Link>
                )}
                {version && (
                    <Nav.Link eventKey={Page.FLUIDNC_CALIBRATE}>
                        <FontAwesomeIcon icon={faSliders as IconDefinition} />{" "}
                        {t("panel.navigation.calibrate")}
                    </Nav.Link>
                )}
                <hr />
                <Nav.Link onClick={restart}>
                    <FontAwesomeIcon icon={faPowerOff as IconDefinition} />{" "}
                    {t("panel.navigation.restart")}
                </Nav.Link>
                <Nav.Link onClick={disconnect}>
                    <FontAwesomeIcon
                        icon={faRightFromBracket as IconDefinition}
                    />{" "}
                    {t("panel.navigation.disconnect")}
                </Nav.Link>
            </Nav>
            <hr className="d-flex d-sm-none" />
        </>
    );
};

export default Navigation;
