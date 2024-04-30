import React from "react";
import { Board } from "../../../model/Boards";
import { Motor, PinConfig } from "../../../model/Config";
import PinField from "../../../components/fields/PinField";
import TextField from "../../../components/fields/TextField";

type SolenoidProps = {
    board: Board;
    motor: Motor;
    updateMotorDriverValue: (motor: Motor) => void;
    usedPins: Map<string, PinConfig>;
};

const Solenoid = ({
    board,
    motor,
    updateMotorDriverValue,
    usedPins
}: SolenoidProps) => {
    return (
        <>
            <PinField
                label="Output pin"
                board={board}
                value={PinConfig.fromString(motor?.solenoid?.output_pin)}
                setValue={(value) =>
                    updateMotorDriverValue({
                        solenoid: {
                            output_pin: value.toString()
                        }
                    })
                }
                usedPins={usedPins}
            />

            <TextField
                label="PWM"
                value={motor?.solenoid?.pwm_hz ?? 50}
                setValue={(value) =>
                    updateMotorDriverValue({
                        solenoid: {
                            pwm_hz: Number(value)
                        }
                    })
                }
                unit="Hz"
            />

            <TextField
                label="Off"
                value={motor?.solenoid?.off_percent ?? 0}
                setValue={(value) =>
                    updateMotorDriverValue({
                        solenoid: {
                            off_percent: Number(value)
                        }
                    })
                }
                unit="%"
            />
            <TextField
                label="Pull"
                value={motor?.solenoid?.pull_percent ?? 100}
                setValue={(value) =>
                    updateMotorDriverValue({
                        solenoid: {
                            pull_percent: Number(value)
                        }
                    })
                }
                unit="%"
            />
            <TextField
                label="Hold"
                value={motor?.solenoid?.hold_percent ?? 75}
                setValue={(value) =>
                    updateMotorDriverValue({
                        solenoid: {
                            hold_percent: Number(value)
                        }
                    })
                }
                unit="%"
            />

            <TextField
                label="Pull time"
                value={motor?.solenoid?.pull_ms ?? 75}
                setValue={(value) =>
                    updateMotorDriverValue({
                        solenoid: {
                            pull_ms: Number(value)
                        }
                    })
                }
                unit="ms"
            />
        </>
    );
};

export default Solenoid;
