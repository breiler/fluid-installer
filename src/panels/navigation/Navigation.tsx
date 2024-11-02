import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
    faDownload,
    faFolderOpen,
    faHome,
    faPowerOff,
    faRefresh,
    faSliders,
    faTerminal,
    faWifi
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { ControllerServiceContext } from "../../context/ControllerServiceContext";
import "./Navigation.scss";
import { Stats } from "../../services/controllerservice/commands/GetStatsCommand";
import RestartModal from "../../components/restartmodal/RestartModal";
import Page from "../../model/Page";
import { VersionCommand } from "../../services/controllerservice/commands/VersionCommand";

const Navigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const controllerService = useContext(ControllerServiceContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [stats, setStats] = useState<Stats>();
    const [version, setVersion] = useState<string>();

    useEffect(() => {
        if (!controllerService) return;
        controllerService.getStats().then(setStats);
        controllerService
            .send(new VersionCommand(), 5000)
            .then((command) => setVersion(command.getVersionNumber()));
    }, [controllerService]);

    const restart = () => {
        setIsLoading(true);
        controllerService?.hardReset().finally(() => setIsLoading(false));
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
                defaultActiveKey="/install"
                className="flex-column navigation-container"
                onSelect={handleSelect}
            >
                <Nav.Link eventKey="/">
                    <FontAwesomeIcon icon={faHome as IconDefinition} /> Home
                </Nav.Link>
                <Nav.Link eventKey={Page.INSTALLER}>
                    <FontAwesomeIcon icon={faDownload as IconDefinition} />{" "}
                    Install
                </Nav.Link>
                <Nav.Link eventKey={Page.TERMINAL}>
                    <FontAwesomeIcon icon={faTerminal as IconDefinition} />{" "}
                    Terminal
                </Nav.Link>
                {version && (
                    <Nav.Link eventKey={Page.FILEBROWSER}>
                        <FontAwesomeIcon
                            icon={faFolderOpen as IconDefinition}
                        />{" "}
                        File browser
                    </Nav.Link>
                )}
                {stats?.version && (
                    <Nav.Link eventKey={Page.WIFI}>
                        <FontAwesomeIcon icon={faWifi as IconDefinition} /> WiFi
                    </Nav.Link>
                )}
                {version && (
                    <Nav.Link eventKey={Page.CALIBRATE}>
                        <FontAwesomeIcon icon={faSliders as IconDefinition} />{" "}
                        Calibrate
                    </Nav.Link>
                )}
                <hr />
                <Nav.Link onClick={restart}>
                    <FontAwesomeIcon icon={faRefresh as IconDefinition} />{" "}
                    Restart
                </Nav.Link>
                <Nav.Link onClick={() => controllerService?.disconnect()}>
                    <FontAwesomeIcon icon={faPowerOff as IconDefinition} />{" "}
                    Disconnect
                </Nav.Link>
            </Nav>
            <hr className="d-flex d-sm-none" />
        </>
    );
};

export default Navigation;
