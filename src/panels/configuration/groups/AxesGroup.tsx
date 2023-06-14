import React from "react";
import { Axes, Pin, PinConfig } from "../../../model/Config";
import AxisGroup from "./AxisGroup";
import PinField from "../fields/PinField";
import { Board } from "../../../model/Boards";
import { Form, Nav, Tab } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faBan } from "@fortawesome/free-solid-svg-icons";

type SelectFieldProps = {
    board: Board;
    axes?: Axes;
    setValue?: (value: Axes) => void;
};

const AxesGroup = ({
    board,
    axes,
    setValue = (value: Axes) => {}
}: SelectFieldProps) => {
    return (
        <>
            <h4>Axes</h4>

            <br />
            <Form.Check
                type="switch"
                label="Use shared pins"
                checked={
                    !!axes?.shared_stepper_disable_pin ||
                    !!axes?.shared_stepper_reset_pin
                }
                onChange={() => {
                    if (
                        !!axes?.shared_stepper_disable_pin ||
                        !!axes?.shared_stepper_reset_pin
                    ) {
                        setValue({
                            ...axes,
                            shared_stepper_disable_pin: undefined,
                            shared_stepper_reset_pin: undefined
                        });
                    } else {
                        setValue({
                            ...axes,
                            shared_stepper_disable_pin: PinConfig.fromString(
                                Pin.NO_PIN
                            ).toString(),
                            shared_stepper_reset_pin: PinConfig.fromString(
                                Pin.NO_PIN
                            ).toString()
                        });
                    }
                }}></Form.Check>

            {!!axes?.shared_stepper_disable_pin && (
                <PinField
                    label="Shared disable pin"
                    board={board}
                    value={PinConfig.fromString(
                        axes?.shared_stepper_disable_pin
                    )}
                    setValue={(value) =>
                        setValue({
                            ...axes,
                            shared_stepper_disable_pin: value.toString()
                        })
                    }
                />
            )}
            {!!axes?.shared_stepper_reset_pin && (
                <PinField
                    label="Shared reset pin"
                    board={board}
                    value={PinConfig.fromString(axes?.shared_stepper_reset_pin)}
                    setValue={(value) =>
                        setValue({
                            ...axes,
                            shared_stepper_reset_pin: value.toString()
                        })
                    }
                />
            )}

            <br />
            <br />

            <Tab.Container defaultActiveKey="axisx">
                <Nav fill variant="tabs">
                    <Nav.Item>
                        <Nav.Link eventKey="axisx">
                            X{" "}
                            {!axes?.x && (
                                <FontAwesomeIcon
                                    icon={faBan as IconDefinition}
                                />
                            )}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="axisy">
                            Y{" "}
                            {!axes?.y && (
                                <FontAwesomeIcon
                                    icon={faBan as IconDefinition}
                                />
                            )}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="axisz">
                            Z{" "}
                            {!axes?.z && (
                                <FontAwesomeIcon
                                    icon={faBan as IconDefinition}
                                />
                            )}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="axisa">
                            A{" "}
                            {!axes?.a && (
                                <FontAwesomeIcon
                                    icon={faBan as IconDefinition}
                                />
                            )}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="axisb">
                            B{" "}
                            {!axes?.b && (
                                <FontAwesomeIcon
                                    icon={faBan as IconDefinition}
                                />
                            )}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="axisc">
                            Z{" "}
                            {!axes?.c && (
                                <FontAwesomeIcon
                                    icon={faBan as IconDefinition}
                                />
                            )}
                        </Nav.Link>
                    </Nav.Item>
                </Nav>

                <Tab.Content>
                    <br />
                    <Tab.Pane eventKey="axisx">
                        <AxisGroup
                            axisLabel="X"
                            axis={axes?.x}
                            setValue={(value) =>
                                setValue({ ...axes, x: value })
                            }
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey="axisy">
                        <AxisGroup
                            axisLabel="Y"
                            axis={axes?.y}
                            setValue={(value) =>
                                setValue({ ...axes, y: value })
                            }
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey="axisz">
                        <AxisGroup
                            axisLabel="Z"
                            axis={axes?.z}
                            setValue={(value) =>
                                setValue({ ...axes, z: value })
                            }
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey="axisa">
                        <AxisGroup
                            axisLabel="A"
                            axis={axes?.a}
                            setValue={(value) =>
                                setValue({ ...axes, a: value })
                            }
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey="axisb">
                        <AxisGroup
                            axisLabel="B"
                            axis={axes?.b}
                            setValue={(value) =>
                                setValue({ ...axes, b: value })
                            }
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey="axisc">
                        <AxisGroup
                            axisLabel="C"
                            axis={axes?.c}
                            setValue={(value) =>
                                setValue({ ...axes, c: value })
                            }
                        />
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </>
    );
};

export default AxesGroup;
