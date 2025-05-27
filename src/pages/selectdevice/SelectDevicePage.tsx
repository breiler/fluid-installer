import React from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Page from "../../model/Page";
const logoUrl = new URL("../../assets/logo-light.svg", import.meta.url);

const SelectDevicePage = () => {
    const navigate = useNavigate();

    return (
        <div className="container" style={{ maxWidth: "800px" }}>
            <Row>
                <Col>
                    <Card>
                        <Card.Img variant="top" src="images/fluidnc6x.jpg" />
                        <Card.Body style={{ textAlign: "center" }}>
                            <Card.Title>
                                <img
                                    src={logoUrl.toString()}
                                    alt="FluidNC"
                                    width={200}
                                />
                            </Card.Title>
                            <Card.Text>
                                Use this option if you want to install, upgrade
                                or configure your FluidNC controller.
                            </Card.Text>

                            <Button
                                variant="primary"
                                onClick={() => navigate(Page.FLUIDNC_HOME)}
                            >
                                Continue
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Img variant="top" src="images/fluiddialhw.png" />
                        <Card.Body style={{ textAlign: "center" }}>
                            <Card.Title>
                                <img
                                    src={"/images/fluiddial.png"}
                                    alt="FluidDial"
                                    width={200}
                                />
                            </Card.Title>
                            <Card.Text>
                                Use this option if you want to install or
                                upgrade your FluidDial pendant.
                            </Card.Text>
                            <Button
                                variant="primary"
                                onClick={() => navigate(Page.FLUID_DIAL_HOME)}
                            >
                                Continue
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SelectDevicePage;
