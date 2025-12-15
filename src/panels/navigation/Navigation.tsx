import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
    faDownload,
    faFolderOpen,
    faHome,
    faRightFromBracket,
    faSliders,
    faTerminal,
    faSquarePollHorizontal,
    faWifi
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Nav } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { ControllerServiceContext } from "../../context/ControllerServiceContext";
import LogModal from "../../modals/logmodal/LogModal";
import "./Navigation.scss";
import Page from "../../model/Page";
import useTrackEvent, {
    TrackAction,
    TrackCategory
} from "../../hooks/useTrackEvent";

const Navigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const trackEvent = useTrackEvent();
    const [showLogModal, setShowLogModal] = useState<boolean>(false);

    const controllerService = useContext(ControllerServiceContext);

    const disconnect = () => {
        trackEvent(TrackCategory.Disconnect, TrackAction.DisconnectClick);
        controllerService?.disconnect(true);
    };

    const handleSelect = (eventKey) => {
        navigate(eventKey);
    };

    return (
        <>
            <LogModal
                show={showLogModal}
                setShow={setShowLogModal}
                rows={controllerService.startupLines}
            />
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
                {controllerService.version !== "?" && (
                    <Nav.Link eventKey={Page.FLUIDNC_FILEBROWSER}>
                        <FontAwesomeIcon
                            icon={faFolderOpen as IconDefinition}
                        />{" "}
                        {t("panel.navigation.file-browser")}
                    </Nav.Link>
                )}
                {controllerService.version !== "?" && (
                    <Nav.Link eventKey={Page.FLUIDNC_CALIBRATE}>
                        <FontAwesomeIcon icon={faSliders as IconDefinition} />{" "}
                        {t("panel.navigation.calibrate")}
                    </Nav.Link>
                )}
                {controllerService.hasWiFi && (
                    <Nav.Link eventKey={Page.FLUIDNC_WIFI}>
                        <FontAwesomeIcon icon={faWifi as IconDefinition} />{" "}
                        {t("panel.navigation.wifi")}
                    </Nav.Link>
                )}
                <hr />
                <Nav.Link onClick={() => setShowLogModal(true)}>
                    <FontAwesomeIcon
                        icon={faSquarePollHorizontal as IconDefinition}
                    />{" "}
                    {t("page.terminal.startup")}
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
