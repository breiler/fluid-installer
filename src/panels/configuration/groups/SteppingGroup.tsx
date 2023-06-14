import React, { useEffect } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { Stepping } from "../../../model/Config";
import TextField from "../fields/TextField";

const DEFAULT_CONFIG: Stepping = {
    engine: "RMT",
    idle_ms: 250,
    pulse_us: 4,
    dir_delay_us: 0,
    disable_delay_us: 0
};

type SteppingGroupProps = {
    steppingConfig?: Stepping;
    setValue?: (config: Stepping) => void;
};

const SteppingGroup = ({
    steppingConfig,
    setValue = (config) => {}
}: SteppingGroupProps) => {

    useEffect(() => {
        if (!steppingConfig) {
            setValue(DEFAULT_CONFIG);
        }
    }, [steppingConfig]);

    return (
        <div style={{marginBottom: "48px"}}>
            <h4>Stepping</h4>
            <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">
                    Engine
                </Form.Label>
                <Col sm="9">
                    <Form.Select
                        aria-label={"Engine"}
                        value={steppingConfig?.engine}
                        onChange={(event) =>
                            setValue({
                                ...steppingConfig,
                                ...{ engine: event.target.value }
                            })
                        }>
                        <option id={"RMT"} value={"RMT"}>
                            RMT
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
                </Col>
            </Form.Group>
            <TextField
                label="Idle time"
                value={steppingConfig?.idle_ms ?? 250}
                unit={"ms"}
                setValue={(value) =>
                    setValue({
                        ...steppingConfig,
                        ...{ idle_ms: Number(value) }
                    })
                }
            />
            <TextField
                label="Pulse time"
                value={steppingConfig?.pulse_us ?? 4}
                unit={"μs"}
                setValue={(value) =>
                    setValue({
                        ...steppingConfig,
                        ...{ pulse_us: Number(value) }
                    })
                }
            />
            <TextField
                label="Direction delay"
                value={steppingConfig?.dir_delay_us ?? 0}
                unit={"μs"}
                setValue={(value) =>
                    setValue({
                        ...steppingConfig,
                        ...{ dir_delay_us: Number(value) }
                    })
                }
            />
            <TextField
                label="Disable delay"
                value={steppingConfig?.disable_delay_us ?? 0}
                unit={"μs"}
                setValue={(value) =>
                    setValue({
                        ...steppingConfig,
                        ...{ disable_delay_us: Number(value) }
                    })
                }
            />
        </div>
    );
};

export default SteppingGroup;
