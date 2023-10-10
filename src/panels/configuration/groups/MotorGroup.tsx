import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import {
    PinConfig,
    Motor,
    Pin,
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

const DEFAULT_CONFIG : Motor = {
    limit_all_pin: PinConfig.fromString(Pin.NO_PIN)!.toString(),
    limit_neg_pin: PinConfig.fromString(Pin.NO_PIN)!.toString(),
    limit_pos_pin: PinConfig.fromString(Pin.NO_PIN)!.toString(),
    hard_limits: false,
    pulloff_mm: 1
}

const MotorGroup = ({ label, board, motor, setValue }: MotorProps) => {
    return (
        <>
            <h5>{label}</h5>
            <Form.Check
                type="switch"
                label="Include"
                checked={!!motor}
                onChange={() => {
                    if (!!motor) {
                        setValue(undefined);
                    } else {
                        setValue(DEFAULT_CONFIG);
                    }
                }}></Form.Check>

            <br />
            <br />
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
                        value={motor?.pulloff_mm ?? 1}
                        unit="mm"
                        setValue={(value) => {
                            setValue({
                                ...motor,
                                ...{ pulloff_mm: Number(value) }
                            });
                        }}
                    />
                    <BooleanField
                        label="Hard limits"
                        value={motor?.hard_limits ?? false}
                        setValue={(value) => {
                            setValue({
                                ...motor,
                                ...{ hard_limits: value }
                            });
                        }}
                        helpText="Enable this when you want to use the switches defined above as hard limits. Hard limits immediately stops all motion when the switch is activated. Position is considered lost and rehoming is required."
                    />
                    <br />
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
