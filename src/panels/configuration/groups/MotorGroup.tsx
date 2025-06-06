import React from "react";
import { Form } from "react-bootstrap";
import { PinConfig, Motor, Pin, Config } from "../../../model/Config";
import PinField from "../../../components/fields/PinField";
import { Board } from "../../../model/Boards";
import BooleanField from "../../../components/fields/BooleanField";
import TextField from "../../../components/fields/TextField";
import MotorDriverGroup from "./MotorDriverGroup";
import CollapseSection from "../../../components/collapsesection/CollapseSection";

type MotorProps = {
    config: Config;
    label: string;
    board: Board;
    motor?: Motor;
    setValue: (motor?: Motor) => void;
    usedPins: Map<string, PinConfig>;
};

const DEFAULT_CONFIG: Motor = {
    limit_all_pin: PinConfig.fromString(Pin.NO_PIN)!.toString(),
    limit_neg_pin: PinConfig.fromString(Pin.NO_PIN)!.toString(),
    limit_pos_pin: PinConfig.fromString(Pin.NO_PIN)!.toString(),
    hard_limits: false,
    pulloff_mm: 1
};

const MotorGroup = ({
    config,
    label,
    board,
    motor,
    setValue,
    usedPins
}: MotorProps) => {
    return (
        <>
            <h5>
                {label}
                <Form.Check
                    style={{ display: "inline", marginLeft: "16px" }}
                    type="switch"
                    checked={!!motor}
                    onChange={() => {
                        if (motor) {
                            setValue(undefined);
                        } else {
                            setValue(DEFAULT_CONFIG);
                        }
                    }}
                ></Form.Check>
            </h5>

            <CollapseSection show={!!motor}>
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
                    usedPins={usedPins}
                    hideI2SO={true}
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
                    usedPins={usedPins}
                    hideI2SO={true}
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
                    usedPins={usedPins}
                    hideI2SO={true}
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
                    config={config}
                    board={board}
                    motor={motor}
                    setValue={(value) => setValue(value)}
                    usedPins={usedPins}
                />
            </CollapseSection>
        </>
    );
};

export default MotorGroup;
