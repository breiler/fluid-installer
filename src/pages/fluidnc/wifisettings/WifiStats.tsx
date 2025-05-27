import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { Stats } from "../../../services/controllerservice/commands/GetStatsCommand";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type Props = {
    stats: Stats;
    onRefresh: () => void;
};

const WiFiStats = ({ stats, onRefresh }: Props) => {
    return (
        <Card bg="light">
            <CardBody>
                <Row>
                    <Col>
                        <Row>
                            <Col sm={5} lg={3} className="text-end">
                                <b>WiFi mode:</b>
                            </Col>
                            <Col> {stats?.currentWifiMode} </Col>
                        </Row>
                        <Row>
                            <Col sm={5} lg={3} className="text-end">
                                <b>Signal:</b>
                            </Col>
                            <Col>{stats?.signal}</Col>
                        </Row>
                        <Row>
                            <Col sm={5} lg={3} className="text-end">
                                <b>SSID:</b>
                            </Col>
                            <Col>{stats?.connectedTo ?? stats?.apSSID}</Col>
                        </Row>
                        <Row>
                            <Col sm={5} lg={3} className="text-end">
                                <b>IP:</b>
                            </Col>
                            <Col> {stats?.ip}</Col>
                        </Row>
                        <Row>
                            <Col sm={5} lg={3} className="text-end">
                                <b>Netmask:</b>
                            </Col>
                            <Col> {stats?.netmask}</Col>
                        </Row>
                        <Row>
                            <Col sm={5} lg={3} className="text-end">
                                <b>Gateway:</b>
                            </Col>
                            <Col>{stats?.gateway} </Col>
                        </Row>
                    </Col>
                    <Col
                        sm={1}
                        className="text-end"
                        style={{ marginRight: "14px" }}
                    >
                        <Button onClick={() => onRefresh()}>
                            <FontAwesomeIcon
                                icon={faRefresh as IconDefinition}
                                size="sm"
                            />
                        </Button>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

export default WiFiStats;
