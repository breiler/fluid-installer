import React from "react";
import { Card, Form } from "react-bootstrap";
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
        <Card>
            <Card.Header>
                <h5>{axisLabel}</h5>
                <Form.Check
                    type="switch"
                    label="Enabled"
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
            </Card.Header>
            {axis && (
                <Card.Body>
                    <h5>General settings</h5>
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
                            setValue({ ...axis, ...{ max_travel_mm: Number(value) } })
                        }
                    />
                    <br />
                    <br />
                    <h5>Homing</h5>
                    <br />
                    <br />

                    <h5>Motor 1</h5>
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
                    <h5>Motor 2</h5>
                    <MotorGroup
                        label={"Motor 2"}
                        board={Boards[0]}
                        motor={axis?.motor1}
                        setValue={(value) => {
                            setValue({ ...axis, ...{ motor1: value } });
                        }}
                    />
                </Card.Body>
            )}
        </Card>
        <br />
    </>
);

export default AxisGroup;
