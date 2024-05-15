import React from "react";
import { Pin, PinConfig } from "../../model/Config";
import { GpioStatus } from "../../services/controllerservice/commands/GetGpioDumpCommand";
import { Badge, Col, Row } from "react-bootstrap";

type Props = {
    label: string;
    pinConfig?: PinConfig;
    gpioStatusList: GpioStatus[];
};

const CalibratePin = ({ label, pinConfig, gpioStatusList }: Props) => {
    const gpioStatus: GpioStatus | undefined = gpioStatusList.find(
        (s) => s.pin === pinConfig?.pin
    );

    if (!pinConfig || pinConfig.pin === Pin.NO_PIN) {
        return;
    }

    return (
        <Row
            style={{
                padding: "5px",
                paddingTop: "14px",
                margin: 0,
                border: "1px solid lightgray"
            }}
        >
            <Col>{label}</Col>
            <Col>
                <h5>
                    {!gpioStatus && <Badge bg="secondary">?</Badge>}

                    {((gpioStatus?.state == 1 && pinConfig?.active == "low") ||
                        (gpioStatus?.state == 0 &&
                            pinConfig?.active == "high")) && (
                        <Badge bg="success">INACTIVE</Badge>
                    )}
                    {((gpioStatus?.state == 0 && pinConfig?.active == "low") ||
                        (gpioStatus?.state == 1 &&
                            pinConfig?.active == "high")) && (
                        <Badge bg="danger">TRIGGERED</Badge>
                    )}
                </h5>
            </Col>
        </Row>
    );
};

export default CalibratePin;
