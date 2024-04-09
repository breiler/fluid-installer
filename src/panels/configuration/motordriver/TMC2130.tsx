import React from "react";
import { Board } from "../../../model/Boards";
import { Motor, PinConfig } from "../../../model/Config";
import BooleanField from "../fields/BooleanField";
import PinField from "../fields/PinField";
import SelectField from "../fields/SelectField";
import TextField from "../fields/TextField";

type TMC2130Props = {
    board: Board;
    motor: Motor;
    updateMotorDriverValue: (motor: Motor) => void;
    usedPins: Map<string, PinConfig>;
};

const TMC2130 = ({
    board,
    motor,
    updateMotorDriverValue,
    usedPins
}: TMC2130Props) => {
    return (
        <>
            <PinField
                label="Step pin"
                board={board}
                value={PinConfig.fromString(motor?.tmc_2130?.step_pin)}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_2130: {
                            step_pin: value.toString()
                        }
                    })
                }
                usedPins={usedPins}
            />

            <PinField
                label="Direction pin"
                board={board}
                value={PinConfig.fromString(motor?.tmc_2130?.direction_pin)}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_2130: {
                            direction_pin: value.toString()
                        }
                    })
                }
                usedPins={usedPins}
            />

            <PinField
                label="Disable pin"
                board={board}
                value={PinConfig.fromString(motor?.tmc_2130?.disable_pin)}
                setValue={(value) =>
                    updateMotorDriverValue({
                        stepstick: {
                            disable_pin: value.toString()
                        }
                    })
                }
                usedPins={usedPins}
            />

            <PinField
                label="CS pin"
                board={board}
                value={PinConfig.fromString(motor?.tmc_2130?.cs_pin)}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_2130: {
                            cs_pin: value.toString()
                        }
                    })
                }
                usedPins={usedPins}
            />

            <TextField
                label="SPI index"
                value={motor?.tmc_2130?.spi_index ?? -1}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_2130: {
                            spi_index: value + ""
                        }
                    })
                }
            />

            <TextField
                label="R Sense"
                value={motor?.tmc_2130?.r_sense_ohms ?? 0.11}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_2130: {
                            r_sense_ohms: Number(value)
                        }
                    })
                }
                unit="Ω"
                helpText="This is the value of the current sense resistor used with the driver. This is needed to set the current."
            />
            <TextField
                label="Hold amps"
                value={motor?.tmc_2130?.hold_amps ?? 0.5}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_2130: {
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
                    motor?.tmc_2130?.microsteps
                        ? motor?.tmc_2130?.microsteps + ""
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
                        tmc_2130: {
                            microsteps: Number(value)
                        }
                    })
                }
            />
            <TextField
                label="Stallguard"
                value={motor?.tmc_2130?.stallguard ?? 0}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_2130: {
                            stallguard: Number(value)
                        }
                    })
                }
                helpText={
                    "Stallguard threshold level where a higher value makes stallGuard2 less sensitive and requires more torque to indicate a stall. See datasheet for more details."
                }
            />

            <BooleanField
                label="Stallguard debug"
                value={motor?.tmc_2130?.stallguard_debug ?? false}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_2130: {
                            stallguard_debug: Boolean(value)
                        }
                    })
                }
            />

            <TextField
                label="TOFF disable"
                value={motor?.tmc_2130?.toff_disable ?? 0}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_2130: {
                            toff_disable: Number(value)
                        }
                    })
                }
                helpText={
                    "TOFF off time and driver enable. A value of 0 disables the driver."
                }
            />

            <TextField
                label="TOFF stealthchop"
                value={motor?.tmc_2130?.toff_stealthchop ?? 5}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_2130: {
                            toff_stealthchop: Number(value)
                        }
                    })
                }
            />

            <TextField
                label="TOFF coolstep"
                value={motor?.tmc_2130?.toff_coolstep ?? 3}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_2130: {
                            toff_coolstep: Number(value)
                        }
                    })
                }
            />

            <SelectField
                label="Run mode"
                value={
                    motor?.tmc_2130?.run_mode
                        ? motor?.tmc_2130?.run_mode + ""
                        : "StealthChop"
                }
                options={[
                    { name: "StealthChop", value: "StealthChop" },
                    { name: "CoolStep", value: "CoolStep" },
                    { name: "Stallguard", value: "Stallguard" }
                ]}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_2130: {
                            run_mode: value
                        }
                    })
                }
            />

            <SelectField
                label="Homing mode"
                value={
                    motor?.tmc_2130?.homing_mode
                        ? motor?.tmc_2130?.homing_mode + ""
                        : "StealthChop"
                }
                options={[
                    { name: "StealthChop", value: "StealthChop" },
                    { name: "CoolStep", value: "CoolStep" },
                    { name: "Stallguard", value: "Stallguard" }
                ]}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_2130: {
                            homing_mode: value
                        }
                    })
                }
            />

            <BooleanField
                label="Use enable"
                value={motor?.tmc_2130?.use_enable ?? false}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_2130: {
                            use_enable: Boolean(value)
                        }
                    })
                }
            />
        </>
    );
};

export default TMC2130;
