import React from "react";
import { Form } from "react-bootstrap";
import {
    PinConfig,
    I2ISO as I2ISOConfig,
    Pin,
    Motor
} from "../../../model/Config";
import PinField from "../fields/PinField";
import { Board } from "../../../model/Boards";
import BooleanField from "../fields/BooleanField";
import TextField from "../fields/TextField";
import MotorDriverGroup from "./MotorDriverGroup";

type MotorProps = {
    label: string;
    board: Board;
    motor?: Motor;
    setValue: (motor?: Motor) => void;
};

const MotorGroup = ({ label, board, motor, setValue }: MotorProps) => {
    return (
        <>
            <Form.Check
                type="switch"
                label="Motor 1"
                checked={!!motor}
                onClick={() => {
                    if (!!motor) {
                        setValue(undefined);
                    } else {
                        setValue({});
                    }
                }}></Form.Check>

            {motor && (
                <>
                    <PinField
                        label="Limit negative pin"
                        board={board}
                        value={PinConfig.fromString(motor?.limit_neg_pin)}
                        setValue={(value) => {
                            setValue({
                                ...motor,
                                ...{ limit_neg_pin: value.toString() }
                            });
                        }}
                    />
                    <PinField
                        label="Limit positive pin"
                        board={board}
                        value={PinConfig.fromString(motor?.limit_pos_pin)}
                        setValue={(value) => {
                            setValue({
                                ...motor,
                                ...{ limit_pos_pin: value.toString() }
                            });
                        }}
                    />
                    <PinField
                        label="Limit all pin"
                        board={board}
                        value={PinConfig.fromString(motor?.limit_all_pin)}
                        setValue={(value) => {
                            setValue({
                                ...motor,
                                ...{ limit_all_pin: value.toString() }
                            });
                        }}
                    />
                    <TextField
                        label="Pull off"
                        value={motor?.pulloff_mm}
                        unit="mm"
                    />
                    <BooleanField
                        label="Hard limits"
                        value={motor?.hard_limits}
                        setValue={(value) => console.log(value)}
                    />
                    <MotorDriverGroup
                        board={board}
                        motor={motor}
                        setValue={(value) => setValue(value)}
                    />
                </>
            )}
        </>
    );
};

export default MotorGroup;
