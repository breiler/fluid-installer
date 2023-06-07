import React from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import { Axis } from "../../../model/Config";
import TextField from "../fields/TextField";
import MotorGroup from "./MotorGroup";
import { Boards } from "../../../model/Boards";
import BooleanField from "../fields/BooleanField";

type SelectFieldProps = {
    axisLabel: string;
    axis?: Axis;
    setValue?: (axis?: Axis) => void;
};

const AxisGroup = ({
    axisLabel,
    axis,
    setValue = (axis?: Axis) => {}
}: SelectFieldProps) => (
    <>
        <h4>{axisLabel}-axis</h4>

        <Form.Check
            type="switch"
            label="Include"
            checked={!!axis}
            onClick={() => {
                if (!!axis) {
                    setValue(undefined);
                } else {
                    setValue({
                        steps_per_mm: 100
                    });
                }
            }}></Form.Check>
        <br />
        <br />

        {axis && (
            <Container>
                <TextField
                    label="Steps/mm"
                    value={axis.steps_per_mm}
                    placeholder="Steps per mm"
                />
                <TextField
                    label="Max rate"
                    value={axis.max_rate_mm_per_min}
                    placeholder="Max rate"
                    unit="mm/min"
                />
                <TextField
                    label="Acceleration"
                    value={axis.acceleration_mm_per_sec2}
                    placeholder="Acceleration"
                    unit="mm/sec²"
                />
                <BooleanField
                    label="Soft limits"
                    value={axis?.soft_limits}
                    setValue={(value) => console.log(value)}
                />
                <TextField
                    label="Max travel"
                    value={axis.max_travel_mm}
                    placeholder="Max travel"
                    unit="mm"
                    setValue={(value) =>
                        setValue({
                            ...axis,
                            ...{ max_travel_mm: Number(value) }
                        })
                    }
                />
                <br />
                <br />

                <MotorGroup
                    label={"Motor 1"}
                    board={Boards[0]}
                    motor={axis?.motor0}
                    setValue={(value) => {
                        setValue({ ...axis, ...{ motor0: value } });
                    }}
                />
                <br />
                <br />

                <MotorGroup
                    label={"Motor 2"}
                    board={Boards[0]}
                    motor={axis?.motor1}
                    setValue={(value) => {
                        setValue({ ...axis, ...{ motor1: value } });
                    }}
                />
            </Container>
        )}

        <br />
    </>
);

export default AxisGroup;
