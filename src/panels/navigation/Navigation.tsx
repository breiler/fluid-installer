import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faPowerOff, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useState } from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ControllerServiceContext } from '../../context/ControllerServiceContext';
import SpinnerModal from '../../components/spinnermodal/SpinnerModal';

const Navigation = () => {
    const navigate = useNavigate();
    const controllerService = useContext(ControllerServiceContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const restart = () => {
        setIsLoading(true);
        controllerService?.hardReset().finally(() => setIsLoading(false));
    };

    return (
        <>
            <SpinnerModal show={isLoading} text="Restarting controller..." />
            <Nav defaultActiveKey="/install" className="flex-column">
                <Nav.Link onClick={() => navigate("/install")}>Install</Nav.Link>
                <Nav.Link onClick={() => navigate("/terminal")}>Terminal</Nav.Link>
                <Nav.Link onClick={() => navigate("/files")}>File browser</Nav.Link>
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