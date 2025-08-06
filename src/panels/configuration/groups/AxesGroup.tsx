import React from "react";
import { Config, Pin, PinConfig } from "../../../model/Config";
import { Board } from "../../../model/Boards";
import { Form, Nav, Tab } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { deepMerge } from "../../../utils/utils";
import AxisGroup from "./AxisGroup";
import PinField from "../../../components/fields/PinField";
import BooleanField from "../../../components/fields/BooleanField";
import SteppingGroup from "./SteppingGroup";
import SelectField from "../../../components/fields/SelectField";

type AxisGroupProps = {
    board: Board;
    config?: Config;
    setValue?: (config: Config) => void;
    usedPins: Map<string, PinConfig>;
};

const AxesGroup = ({
    board,
    config,
    setValue = () => {},
    usedPins
}: AxisGroupProps) => {
    return (
        <>
            <h4>Axes</h4>
            <BooleanField
                label="Require homing on startup"
                value={config?.start?.must_home ?? true}
                setValue={(value) =>
                    setValue({
                        ...config!,
                        start: {
                            ...config?.start,
                            must_home: Boolean(value)
                        }
                    })
                }
                helpText="This controls whether you are required to home at startup or not. You will get an homing alarm at startup if this value is true. This prevents motion until you home the machine or clear the alarm."
            />

            <SelectField
                label="Homing runs"
                value={
                    config?.axes?.homing_runs
                        ? config?.axes?.homing_runs + ""
                        : "2"
                }
                setValue={(value) =>
                    setValue({
                        ...config!,
                        axes: {
                            ...config?.axes,
                            homing_runs: Number(value)
                        }
                    })
                }
                options={[
                    {
                        name: "1",
                        value: "1"
                    },
                    {
                        name: "2",
                        value: "2"
                    },
                    {
                        name: "3",
                        value: "3"
                    },
                    {
                        name: "4",
                        value: "4"
                    },
                    {
                        name: "5",
                        value: "5"
                    }
                ]}
                helpText="This sets the number of touches during the homing sequence. The default is 2 to match the GRBL style."
            />

            <BooleanField
                label="Deactivate parking"
                value={config?.start?.deactivate_parking ?? true}
                setValue={(value) =>
                    setValue({
                        ...config!,
                        start: {
                            ...config?.start,
                            deactivate_parking: Boolean(value)
                        }
                    })
                }
            />

            <BooleanField
                label="Check limits"
                value={config?.start?.check_limits ?? false}
                setValue={(value) =>
                    setValue({
                        ...config!,
                        start: {
                            ...config?.start,
                            check_limits: Boolean(value)
                        }
                    })
                }
                helpText="If true this will report if any limit switches are active at startup if hard_limits is true for the axis."
            />

            <br />
            <Form.Check
                type="switch"
                label="Use shared pins"
                checked={
                    !!config?.axes?.shared_stepper_disable_pin ||
                    !!config?.axes?.shared_stepper_reset_pin
                }
                onChange={() => {
                    if (
                        !!config?.axes?.shared_stepper_disable_pin ||
                        !!config?.axes?.shared_stepper_reset_pin
                    ) {
                        setValue({
                            ...config,
                            axes: {
                                ...config.axes,
                                shared_stepper_disable_pin: undefined,
                                shared_stepper_reset_pin: undefined
                            }
                        });
                    } else {
                        setValue({
                            ...config,
                            axes: {
                                ...config!.axes,
                                shared_stepper_disable_pin:
                                    PinConfig.fromString(
                                        Pin.NO_PIN
                                    )!.toString(),
                                shared_stepper_reset_pin: PinConfig.fromString(
                                    Pin.NO_PIN
                                )!.toString()
                            }
                        });
                    }
                }}
            ></Form.Check>

            {!!config?.axes?.shared_stepper_disable_pin && (
                <PinField
                    label="Shared disable pin"
                    board={board}
                    value={PinConfig.fromString(
                        config?.axes?.shared_stepper_disable_pin
                    )}
                    setValue={(value) =>
                        setValue({
                            ...config,
                            axes: {
                                ...config.axes,
                                shared_stepper_disable_pin: value.toString()
                            }
                        })
                    }
                    usedPins={usedPins}
                />
            )}
            {!!config?.axes?.shared_stepper_reset_pin && (
                <PinField
                    label="Shared reset pin"
                    board={board}
                    value={PinConfig.fromString(
                        config?.axes?.shared_stepper_reset_pin
                    )}
                    setValue={(value) =>
                        setValue({
                            ...config,
                            axes: {
                                ...config.axes,
                                shared_stepper_reset_pin: value.toString()
                            }
                        })
                    }
                    usedPins={usedPins}
                />
            )}

            <br />

            <SteppingGroup
                config={config}
                setValue={(stepping) =>
                    setValue({
                        ...config!,
                        stepping: stepping
                    })
                }
            />

            <br />

            <Tab.Container defaultActiveKey="axisx">
                <Nav fill variant="tabs">
                    <Nav.Item>
                        <Nav.Link eventKey="axisx">
                            X{" "}
                            {!config?.axes?.x && (
                                <FontAwesomeIcon
                                    icon={faBan as IconDefinition}
                                />
                            )}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="axisy">
                            Y{" "}
                            {!config?.axes?.y && (
                                <FontAwesomeIcon
                                    icon={faBan as IconDefinition}
                                />
                            )}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="axisz">
                            Z{" "}
                            {!config?.axes?.z && (
                                <FontAwesomeIcon
                                    icon={faBan as IconDefinition}
                                />
                            )}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="axisa">
                            A{" "}
                            {!config?.axes?.a && (
                                <FontAwesomeIcon
                                    icon={faBan as IconDefinition}
                                />
                            )}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="axisb">
                            B{" "}
                            {!config?.axes?.b && (
                                <FontAwesomeIcon
                                    icon={faBan as IconDefinition}
                                />
                            )}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="axisc">
                            C{" "}
                            {!config?.axes?.c && (
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
                            config={config}
                            axisLabel="X"
                            axis={config?.axes?.x}
                            setValue={(value) =>
                                setValue({
                                    ...config!,
                                    axes: { ...config?.axes, x: value }
                                })
                            }
                            usedPins={usedPins}
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey="axisy">
                        <AxisGroup
                            config={config}
                            axisLabel="Y"
                            axis={config?.axes?.y}
                            setValue={(value) =>
                                setValue({
                                    ...config!,
                                    axes: { ...config?.axes, y: value }
                                })
                            }
                            usedPins={usedPins}
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey="axisz">
                        <AxisGroup
                            config={config}
                            axisLabel="Z"
                            axis={config?.axes?.z}
                            setValue={(value) =>
                                setValue(
                                    deepMerge(config!, {
                                        axes: { z: value }
                                    })
                                )
                            }
                            usedPins={usedPins}
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey="axisa">
                        <AxisGroup
                            config={config}
                            axisLabel="A"
                            axis={config?.axes?.a}
                            setValue={(value) =>
                                setValue({
                                    ...config!,
                                    axes: { ...config?.axes, a: value }
                                })
                            }
                            usedPins={usedPins}
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey="axisb">
                        <AxisGroup
                            config={config}
                            axisLabel="B"
                            axis={config?.axes?.b}
                            setValue={(value) =>
                                setValue({
                                    ...config!,
                                    axes: { ...config?.axes, b: value }
                                })
                            }
                            usedPins={usedPins}
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey="axisc">
                        <AxisGroup
                            config={config}
                            axisLabel="C"
                            axis={config?.axes?.c}
                            setValue={(value) =>
                                setValue({
                                    ...config!,
                                    axes: { ...config?.axes, c: value }
                                })
                            }
                            usedPins={usedPins}
                        />
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </>
    );
};

export default AxesGroup;
