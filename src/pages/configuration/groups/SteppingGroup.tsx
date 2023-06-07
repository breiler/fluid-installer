import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import {  SPI as SPIConfig, Stepping } from "../../../model/Config";
import TextField from "../fields/TextField";

type SteppingGroupProps = {
    steppingConfig?: Stepping;
    setValue?: (config: Stepping) => void;
};

const SteppingGroup = ({ steppingConfig, setValue }: SteppingGroupProps) => {
    return (
        <>
            <h4>Stepping</h4>
            <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">
                    Engine
                </Form.Label>
                <Col sm="9">
                    <Form.Select
                        aria-label={"Engine"}
                        value={steppingConfig?.engine}>
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
                value={steppingConfig?.idle_ms}
                unit={"ms"}
            />
            <TextField
                label="Pulse time"
                value={steppingConfig?.pulse_us}
                unit={"μs"}
            />
            <TextField
                label="Direction delay"
                value={steppingConfig?.dir_delay_us}
                unit={"μs"}
            />
            <TextField
                label="Disable delay"
                value={steppingConfig?.disable_delay_us}
                unit={"μs"}
            />

            <br />
            <br />
        </>
    );
};

export default SteppingGroup;
