import React from "react";
import { Board } from "../../../model/Boards";
import { Motor, PinConfig } from "../../../model/Config";
import PinField from "../fields/PinField";

type StandardStepperProps = {
    board: Board;
    motor: Motor;
    updateMotorDriverValue: (motor: Motor) => void;
    usedPins: Map<string, PinConfig>;
};

const StandardStepper = ({
    board,
    motor,
    updateMotorDriverValue,
    usedPins
}: StandardStepperProps) => {
    return (
        <>
            <PinField
                label="Step pin"
                board={board}
                value={PinConfig.fromString(motor?.standard_stepper?.step_pin)}
                setValue={(value) =>
                    updateMotorDriverValue({
                        standard_stepper: {
                            step_pin: value.toString()
                        }
                    })
                }
                usedPins={usedPins}
            />
            <PinField
                label="Direction pin"
                board={board}
                value={PinConfig.fromString(
                    motor?.standard_stepper?.direction_pin
                )}
                setValue={(value) =>
                    updateMotorDriverValue({
                        standard_stepper: {
                            direction_pin: value.toString()
                        }
                    })
                }
                usedPins={usedPins}
            />
            <PinField
                label="Disable pin"
                board={board}
                value={PinConfig.fromString(
                    motor?.standard_stepper?.disable_pin
                )}
                setValue={(value) =>
                    updateMotorDriverValue({
                        standard_stepper: {
                            disable_pin: value.toString()
                        }
                    })
                }
                usedPins={usedPins}
            />
        </>
    );
};

export default StandardStepper;
