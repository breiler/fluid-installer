import React, { useEffect } from "react";
import { Alert, Col, Form, Row } from "react-bootstrap";
import { Config, Stepping } from "../../../model/Config";
import TextField from "../../../components/fields/TextField";
import ToolTip from "../../../components/tooltip/ToolTip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const DEFAULT_CONFIG: Stepping = {
    engine: "RMT",
    idle_ms: 250,
    pulse_us: 4,
    dir_delay_us: 0,
    disable_delay_us: 0
};

type SteppingGroupProps = {
    config?: Config;
    setValue?: (config: Stepping) => void;
};

const SteppingGroup = ({ config, setValue = () => {} }: SteppingGroupProps) => {
    useEffect(() => {
        if (!config?.stepping) {
            setValue(DEFAULT_CONFIG);
        }
    }, [config?.stepping]);

    const showI2soWarning =
        !config?.i2so &&
        (config?.stepping?.engine?.toUpperCase() === "I2S_STATIC" ||
            config?.stepping?.engine?.toUpperCase() === "I2S_STREAM");

    return (
        <div style={{ marginBottom: "48px" }}>
            <h4>Stepping engine</h4>
            <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4">
                    Engine{" "}
                    <ToolTip>
                        This determines the method used to generate the steps in
                        firmware. Controller board hardware is designed for
                        either RMT or I2S stepping so you must choose a method
                        that your controller board hardware uses. It is not
                        possible to mix and match stepping types on different
                        motors.
                    </ToolTip>
                </Form.Label>
                <Col sm="8">
                    <Form.Select
                        aria-label={"Engine"}
                        value={config?.stepping?.engine?.toUpperCase()}
                        onChange={(event) =>
                            setValue({
                                ...config?.stepping,
                                ...{ engine: event.target.value }
                            })
                        }
                    >
                        <option id={"RMT"} value={"RMT"}>
                            RMT (using GPIO)
                        </option>
                        <option id={"TIMED"} value={"TIMED"}>
                            TIMED
                        </option>
                        <option id={"I2S_STATIC"} value={"I2S_STATIC"}>
                            I2S_STATIC
                        </option>
                        <option id={"I2S_STREAM"} value={"I2S_STREAM"}>
                            I2S_STREAM
                        </option>
                    </Form.Select>

                    {showI2soWarning && (
                        <Form.Text muted>
                            <Alert
                                variant="warning"
                                style={{ marginTop: "16px" }}
                            >
                                <FontAwesomeIcon
                                    color="warning"
                                    icon={faWarning as IconDefinition}
                                />{" "}
                                You have selected a I2SO stepping engine without
                                a configured IO, remember to add it.
                            </Alert>
                        </Form.Text>
                    )}
                </Col>
            </Form.Group>

            <TextField
                label="Idle time"
                value={config?.stepping?.idle_ms ?? 250}
                unit={"ms"}
                setValue={(value) =>
                    setValue({
                        ...config?.stepping,
                        ...{ idle_ms: Number(value) }
                    })
                }
                helpText="A value of 255 will keep the motors enabled at all times (preferred for most projects). Any value between 0-254 will cause the disabled pin to activate this many milliseconds after the last step."
            />
            <TextField
                label="Pulse time"
                value={config?.stepping?.pulse_us ?? 4}
                unit={"μs"}
                setValue={(value) =>
                    setValue({
                        ...config?.stepping,
                        ...{ pulse_us: Number(value) }
                    })
                }
                helpText="The duration of the step pulses (microseconds). This is the 'on' duration of the pulse. It typically needs an equal 'off' duration. This means the max number of steps per second will be 1,000,000/(pulse_us*2). Stepper drivers will have a minimum required time length for pulses to register them. If the manufacturer provides a datasheet for the stepper driver, this value can be found there."
            />
            <TextField
                label="Direction delay"
                value={config?.stepping?.dir_delay_us ?? 0}
                unit={"μs"}
                setValue={(value) =>
                    setValue({
                        ...config?.stepping,
                        ...{ dir_delay_us: Number(value) }
                    })
                }
                helpText="The delay(microseconds) needed between a direction change and a step pulse. Many drivers do not need a delay here."
            />
            <TextField
                label="Disable delay"
                value={config?.stepping?.disable_delay_us ?? 0}
                unit={"μs"}
                setValue={(value) =>
                    setValue({
                        ...config?.stepping,
                        ...{ disable_delay_us: Number(value) }
                    })
                }
                helpText="Some motors need a delay from when they are enabled to when they can take the first step. This value is the number of microsecond delayed."
            />
        </div>
    );
};

export default SteppingGroup;
