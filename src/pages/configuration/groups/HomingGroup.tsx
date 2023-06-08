import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import { PinConfig, Homing } from "../../../model/Config";
import PinField from "../fields/PinField";
import { Board } from "../../../model/Boards";
import BooleanField from "../fields/BooleanField";
import TextField from "../fields/TextField";
import MotorDriverGroup from "./MotorDriverGroup";

type HomingProps = {
    homing?: Homing;
    setValue: (motor?: Homing) => void;
};

const HomingGroup = ({ homing, setValue }: HomingProps) => {
    return (
        <>
            <h5>Homing</h5>
            <Form.Check
                type="switch"
                label="Include"
                checked={!!homing}
                onClick={() => {
                    if (!!homing) {
                        setValue(undefined);
                    } else {
                        setValue({});
                    }
                }}></Form.Check>

            <br />
            <br />
            {homing && (
                <>
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
                </>
            )}
        </>
    );
};

export default HomingGroup;
