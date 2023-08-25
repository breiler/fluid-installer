import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faPowerOff, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { ControllerServiceContext } from '../../context/ControllerServiceContext';
import SpinnerModal from '../../components/spinnermodal/SpinnerModal';
import "./Navigation.scss";
import { Stats } from '../../services/controllerservice/commands/GetStatsCommand';

const Navigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const controllerService = useContext(ControllerServiceContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [stats, setStats] = useState<Stats>();

    useEffect(() => {
        if (!controllerService) return;
        controllerService.getStats().then(setStats);
    }, [controllerService]);

    useEffect(() => {
        if (!window.gtag) {
            return;
        }

        window.gtag('event', 'page_view', {
            page_title: location.pathname,
            page_location: window.location.href
        })
    }, [location.pathname]);

    const restart = () => {
        setIsLoading(true);
        controllerService?.hardReset().finally(() => setIsLoading(false));
    };

    const handleSelect = (eventKey) => {
        navigate(eventKey);
    }

    return (
        <>
            <SpinnerModal show={isLoading} text="Restarting controller..." />
            <Nav variant="pills" activeKey={location.pathname} defaultActiveKey="/install" className="flex-column navigation-container" onSelect={handleSelect}>
                <Nav.Link eventKey="/">Home</Nav.Link>
                <Nav.Link eventKey="/install">Install</Nav.Link>
                <Nav.Link eventKey="/terminal">Terminal</Nav.Link>
                {stats?.version && (<Nav.Link eventKey="/files">File browser</Nav.Link>)}
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
        </>
    );
}

export default Navigation;