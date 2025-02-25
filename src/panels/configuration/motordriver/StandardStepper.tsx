import React from "react";
import { Board } from "../../../model/Boards";
import { Config, Motor, PinConfig } from "../../../model/Config";
import PinField from "../../../components/fields/PinField";

type StandardStepperProps = {
    config: Config;
    board: Board;
    motor: Motor;
    updateMotorDriverValue: (motor: Motor) => void;
    usedPins: Map<string, PinConfig>;
};

const StandardStepper = ({
    config,
    board,
    motor,
    updateMotorDriverValue,
    usedPins
}: StandardStepperProps) => {
    const steppingIsI2SO =
        config?.stepping?.engine === "I2S_STATIC" ||
        config?.stepping?.engine === "I2S_STREAM";
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
                hideGPIO={steppingIsI2SO}
                hideI2SO={!steppingIsI2SO}
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
                hideGPIO={steppingIsI2SO}
                hideI2SO={!steppingIsI2SO}
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
                hideGPIO={steppingIsI2SO}
                hideI2SO={!steppingIsI2SO}
            />
        </>
    );
};

export default StandardStepper;
