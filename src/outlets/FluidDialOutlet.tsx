import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import { SerialPort } from "../utils/serialport/SerialPort";
import { SerialPortContext } from "../context/SerialPortContext";
import Connection from "../pages/fluiddial/connection/Connection";

const FluidDialOutlet = () => {
    const [serialPort, setSerialPort] = useState<SerialPort | undefined>();

    if (!serialPort) {
        return <Connection onConnect={setSerialPort} />;
    }

    return (
        <Container>
            <Row>
                <Col sm={0} md={2} lg={3}></Col>
                <Col sm={12} md={8} lg={9} style={{ marginTop: "32px" }}>
                    <SerialPortContext.Provider value={serialPort}>
                        <Outlet />
                    </SerialPortContext.Provider>
                </Col>
            </Row>
        </Container>
    );
};

export default FluidDialOutlet;
