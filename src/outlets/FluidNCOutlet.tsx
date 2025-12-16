import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ControllerServiceContext } from "../context/ControllerServiceContext";
import LostConnectionModal from "../modals/lostconnectionmodal/LostConnectionModal";
import { ControllerService, ControllerStatus } from "../services";
import useControllerStatus from "../hooks/useControllerStatus";
import { Col, Container, Row } from "react-bootstrap";
import Navigation from "../panels/navigation/Navigation";
import Connection from "../pages/fluidnc/connection/Connection";
import { TerminalPopup } from "../components/terminalpopup/TerminalPopup";
import usePopupTerminalStore from "../store/PopupTerminalStore";

const FluidNCOutlet = () => {
    const [controllerService, setControllerService] =
        useState<ControllerService>();
    const { setIsConnected } = usePopupTerminalStore();

    const onCloseConnection = () => {
        setControllerService(undefined);
    };

    const controllerStatus = useControllerStatus(controllerService);
    useEffect(() => {
        setIsConnected(controllerStatus !== ControllerStatus.DISCONNECTED);
    }, [controllerStatus]);

    if (
        !controllerService ||
        controllerStatus === ControllerStatus.DISCONNECTED
    ) {
        return <Connection onConnect={setControllerService} />;
    }

    return (
        <ControllerServiceContext.Provider value={controllerService}>
            <Container>
                <Row>
                    <Col sm={5} md={4} lg={3}>
                        <Navigation />
                    </Col>
                    <Col sm={7} md={8} lg={9} style={{ marginTop: "32px" }}>
                        <LostConnectionModal onClose={onCloseConnection} />
                        <Outlet />
                    </Col>
                </Row>
            </Container>
            <TerminalPopup />
        </ControllerServiceContext.Provider>
    );
};

export default FluidNCOutlet;
