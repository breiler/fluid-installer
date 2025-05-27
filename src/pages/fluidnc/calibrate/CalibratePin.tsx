import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { Pin, PinActive, PinConfig, PinPull } from "../../../model/Config";
import { GpioStatus } from "../../../services/controllerservice/commands/GetGpioDumpCommand";
import "./CalibratePin.scss";

type Props = {
    label: string;
    pinConfig?: PinConfig;
    gpioStatusList: GpioStatus[];
    onUpdateConfig: (pinConfig: PinConfig) => void;
};

type EditPinModalProps = {
    name: string;
    show: boolean;
    setShow: (show: boolean) => void;
    pinConfig: PinConfig;
    onUpdatePin: (pinConfig: PinConfig) => void;
};

const EditPinModal = ({
    name,
    show,
    setShow,
    pinConfig,
    onUpdatePin
}: EditPinModalProps) => {
    const [editConfig, setEditConfig] = useState<PinConfig>(pinConfig);
    useEffect(() => {
        setEditConfig(pinConfig);
    }, []);

    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {name} ({pinConfig.pin})
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Label>Use internal pull resistor:</Form.Label>
                <Form.Select
                    aria-label="Pulling resistor"
                    value={editConfig.pull + ""}
                    onChange={(event) => {
                        setEditConfig((c) => {
                            return new PinConfig(
                                c.pin,
                                event.target.value,
                                c.active
                            );
                        });
                    }}
                >
                    <option key={"none"} id={"none"} value="">
                        No pull
                    </option>
                    <option key={PinPull.UP} id={PinPull.UP} value={PinPull.UP}>
                        Pull up
                    </option>
                    <option
                        key={PinPull.DOWN}
                        id={PinPull.DOWN}
                        value={PinPull.DOWN}
                    >
                        Pull down
                    </option>
                </Form.Select>
                <br />
                <Form.Label>Invert the triggering of the pin:</Form.Label>
                <InputGroup.Text>
                    <Form.Check
                        type="checkbox"
                        label="Invert"
                        checked={editConfig.active === PinActive.LOW}
                        onChange={(event) => {
                            setEditConfig((c) => {
                                return new PinConfig(
                                    c.pin,
                                    c.pull,
                                    event.target.checked
                                        ? PinActive.LOW
                                        : PinActive.HIGH
                                );
                            });
                        }}
                    />
                </InputGroup.Text>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Close
                </Button>
                <Button
                    variant="primary"
                    onClick={() => onUpdatePin(editConfig)}
                >
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const CalibratePin = ({
    label,
    pinConfig,
    gpioStatusList,
    onUpdateConfig
}: Props) => {
    const [isEdit, setIsEdit] = useState(false);
    const gpioStatus: GpioStatus | undefined = gpioStatusList.find(
        (s) => s.pin === pinConfig?.pin
    );

    if (!pinConfig || pinConfig.pin === Pin.NO_PIN) {
        return;
    }

    return (
        <div>
            <EditPinModal
                name={label}
                show={isEdit}
                setShow={setIsEdit}
                pinConfig={pinConfig!}
                onUpdatePin={(config) => {
                    setIsEdit(false);
                    onUpdateConfig(config);
                }}
            />
            <Row
                style={{
                    padding: "6px",
                    margin: 0,
                    border: "1px solid lightgray",
                    verticalAlign: "middle"
                }}
                className="calibratePin align-items-center"
            >
                <Col>
                    <b>{pinConfig.pin}</b>
                    <br />
                    {label}
                </Col>
                <Col className="text-end" style={{ paddingRight: 0 }}>
                    <span style={{ marginRight: "10px" }}>
                        {!gpioStatus && <span className="badge">?</span>}

                        {((gpioStatus?.state == 1 &&
                            pinConfig?.active == "low") ||
                            (gpioStatus?.state == 0 &&
                                pinConfig?.active == "high")) && (
                            <span className="badge badgeInactive">
                                INACTIVE
                            </span>
                        )}
                        {((gpioStatus?.state == 0 &&
                            pinConfig?.active == "low") ||
                            (gpioStatus?.state == 1 &&
                                pinConfig?.active == "high")) && (
                            <span className="badge badgeTriggered">
                                TRIGGERED
                            </span>
                        )}
                    </span>
                    <Button
                        style={{ marginRight: 0 }}
                        onClick={() => setIsEdit(true)}
                    >
                        <FontAwesomeIcon icon={faCog as IconDefinition} />
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default CalibratePin;
