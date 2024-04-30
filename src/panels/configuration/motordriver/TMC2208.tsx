import React from "react";
import { Board } from "../../../model/Boards";
import { Motor, PinConfig } from "../../../model/Config";
import PinField from "../../../components/fields/PinField";
import SelectField from "../../../components/fields/SelectField";
import TextField from "../../../components/fields/TextField";

type TMC2208Props = {
    board: Board;
    motor: Motor;
    updateMotorDriverValue: (motor: Motor) => void;
    usedPins: Map<string, PinConfig>;
};

const TMC2208 = ({
    board,
    motor,
    updateMotorDriverValue,
    usedPins
}: TMC2208Props) => {
    return (
        <>
            <PinField
                label="Step pin"
                board={board}
                value={PinConfig.fromString(motor?.tmc_2208?.step_pin)}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_2208: {
                            step_pin: value.toString()
                        }
                    })
                }
                usedPins={usedPins}
            />

            <PinField
                label="Direction pin"
                board={board}
                value={PinConfig.fromString(motor?.tmc_2208?.direction_pin)}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_2208: {
                            direction_pin: value.toString()
                        }
                    })
                }
                usedPins={usedPins}
            />

            <PinField
                label="Disable pin"
                board={board}
                value={PinConfig.fromString(motor?.tmc_2208?.disable_pin)}
                setValue={(value) =>
                    updateMotorDriverValue({
                        stepstick: {
                            disable_pin: value.toString()
                        }
                    })
                }
                usedPins={usedPins}
            />

            <TextField
                label="R Sense"
                value={motor?.tmc_2208?.r_sense_ohms ?? 0.11}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_2208: {
                            r_sense_ohms: Number(value)
                        }
                    })
                }
                unit="Ω"
                helpText="This is the value of the current sense resistor used with the driver. This is needed to set the current."
            />
            <TextField
                label="Hold amps"
                value={motor?.tmc_2208?.hold_amps ?? 0.5}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_2208: {
                            hold_amps: Number(value)
                        }
                    })
                }
                unit="A"
                helpText="This value sets the driver's output current when the driver is not outputing steps."
            />
            <SelectField
                label="Microsteps"
                value={
                    motor?.tmc_2208?.microsteps
                        ? motor?.tmc_2208?.microsteps + ""
                        : "16"
                }
                options={[
                    { name: "1", value: "1" },
                    { name: "2", value: "2" },
                    { name: "4", value: "4" },
                    { name: "8", value: "8" },
                    { name: "16", value: "16" },
                    { name: "32", value: "32" },
                    { name: "128", value: "128" },
                    { name: "256", value: "256" }
                ]}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_2208: {
                            microsteps: Number(value)
                        }
                    })
                }
            />
        </>
    );
};

export default TMC2208;
