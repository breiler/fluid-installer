import React from "react";
import { Form } from "react-bootstrap";
import { Homing } from "../../../model/Config";
import BooleanField from "../../../components/fields/BooleanField";
import TextField from "../../../components/fields/TextField";
import CollapseSection from "../../../components/collapsesection/CollapseSection";

type HomingProps = {
    homing?: Homing;
    setValue: (motor?: Homing) => void;
};

const HomingGroup = ({ homing, setValue }: HomingProps) => {
    return (
        <>
            <h5>
                Homing
                <Form.Check
                    style={{ display: "inline", marginLeft: "16px" }}
                    type="switch"
                    checked={!!homing}
                    onChange={() => {
                        if (homing) {
                            setValue(undefined);
                        } else {
                            setValue({
                                cycle: -1
                            });
                        }
                    }}
                ></Form.Check>
            </h5>

            <CollapseSection show={!!homing}>
                <TextField
                    label="Cycle"
                    value={Number(homing?.cycle ?? -1)}
                    setValue={(value) => {
                        setValue({
                            ...homing,
                            ...{ cycle: Number(value) }
                        });
                    }}
                />
                <TextField
                    label="Position"
                    value={Number(homing?.mpos_mm ?? 0)}
                    setValue={(value) => {
                        setValue({
                            ...homing,
                            ...{ mpos_mm: Number(value) }
                        });
                    }}
                    unit="mm"
                    helpText="Sets the machine position after homing and limit switch pull-off in millimeters. If you want the machine position to be zero at the limit switch, set this to zero. Keep in mind the homing direction when you choose this number."
                />
                <BooleanField
                    label="Positive direction"
                    value={homing?.positive_direction ?? true}
                    setValue={(value) => {
                        setValue({
                            ...homing,
                            ...{ positive_direction: Boolean(value) }
                        });
                    }}
                    helpText="Controls the direction in which the axis moves when homing."
                />
            </CollapseSection>
        </>
    );
};

export default HomingGroup;
