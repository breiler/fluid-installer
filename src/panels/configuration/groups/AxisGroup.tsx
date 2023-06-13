import React from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import { Axis } from "../../../model/Config";
import TextField from "../fields/TextField";
import MotorGroup from "./MotorGroup";
import { Boards } from "../../../model/Boards";
import BooleanField from "../fields/BooleanField";
import HomingGroup from "./HomingGroup";

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
                    value={axis.steps_per_mm ?? 80}
                    placeholder="Steps per mm"
                    setValue={(value) =>
                        setValue({
                            ...axis,
                            ...{ steps_per_mm: Number(value) }
                        })
                    }
                />
                <TextField
                    label="Max rate"
                    value={axis.max_rate_mm_per_min ?? 1000}
                    placeholder="Max rate"
                    unit="mm/min"
                    setValue={(value) =>
                        setValue({
                            ...axis,
                            ...{ max_rate_mm_per_min: Number(value) }
                        })
                    }
                />
                <TextField
                    label="Acceleration"
                    value={axis.acceleration_mm_per_sec2 ?? 25}
                    placeholder="Acceleration"
                    unit="mm/sec²"
                    setValue={(value) =>
                        setValue({
                            ...axis,
                            ...{ acceleration_mm_per_sec2: Number(value) }
                        })
                    }
                />
                <TextField
                    label="Max travel"
                    value={axis.max_travel_mm ?? 1000.0}
                    placeholder="Max travel"
                    unit="mm"
                    setValue={(value) =>
                        setValue({
                            ...axis,
                            ...{ max_travel_mm: Number(value) }
                        })
                    }
                />
                <BooleanField
                    label="Soft limits"
                    value={axis?.soft_limits ?? false}
                    setValue={(value) =>
                        setValue({
                            ...axis,
                            ...{ soft_limits: Boolean(value) }
                        })
                    }
                    helpText="If enabled, commands that would cause the machine to exceed 'Max travel' will be aborted. Soft limits relies on an accurate machine position. This typically requires homing first. If you use soft limits always home the axis before moving the axis via jogs or gcode."
                />
                <br />
                <br />
                <HomingGroup
                    homing={axis?.homing}
                    setValue={(value) => {
                        setValue({
                            ...axis,
                            ...{ homing: value }
                        });
                    }}
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
