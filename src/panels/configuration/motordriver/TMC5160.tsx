import React from "react";
import { Board } from "../../../model/Boards";
import { Config, Motor, PinConfig } from "../../../model/Config";
import BooleanField from "../../../components/fields/BooleanField";
import PinField from "../../../components/fields/PinField";
import SelectField from "../../../components/fields/SelectField";
import TextField from "../../../components/fields/TextField";

type TMC5160Props = {
    config: Config;
    board: Board;
    motor: Motor;
    updateMotorDriverValue: (motor: Motor) => void;
    usedPins: Map<string, PinConfig>;
};

const TMC5160 = ({
    config,
    board,
    motor,
    updateMotorDriverValue,
    usedPins
}: TMC5160Props) => {
    const steppingIsI2SO =
        config?.stepping?.engine === "I2S_STATIC" ||
        config?.stepping?.engine === "I2S_STREAM";

    return (
        <>
            <PinField
                label="Step pin"
                board={board}
                value={PinConfig.fromString(motor?.tmc_5160?.step_pin)}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_5160: {
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
                value={PinConfig.fromString(motor?.tmc_5160?.direction_pin)}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_5160: {
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
                value={PinConfig.fromString(motor?.tmc_5160?.disable_pin)}
                setValue={(value) =>
                    updateMotorDriverValue({
                        stepstick: {
                            disable_pin: value.toString()
                        }
                    })
                }
                usedPins={usedPins}
                hideGPIO={steppingIsI2SO}
                hideI2SO={!steppingIsI2SO}
            />

            <PinField
                label="CS pin"
                board={board}
                value={PinConfig.fromString(motor?.tmc_5160?.cs_pin)}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_5160: {
                            cs_pin: value.toString()
                        }
                    })
                }
                usedPins={usedPins}
                hideGPIO={steppingIsI2SO}
                hideI2SO={!steppingIsI2SO}
            />

            <TextField
                label="SPI index"
                value={motor?.tmc_5160?.spi_index ?? -1}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_5160: {
                            spi_index: value + ""
                        }
                    })
                }
            />

            <TextField
                label="R Sense"
                value={motor?.tmc_5160?.r_sense_ohms ?? 0.11}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_5160: {
                            r_sense_ohms: Number(value)
                        }
                    })
                }
                unit="Ω"
                helpText="This is the value of the current sense resistor used with the driver. This is needed to set the current."
            />
            <TextField
                label="Hold amps"
                value={motor?.tmc_5160?.hold_amps ?? 0.5}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_5160: {
                            hold_amps: Number(value)
                        }
                    })
                }
                unit="A"
                helpText="This value sets the driver's output current when the driver is not outputing steps."
            />
            <TextField
                label="Stallguard"
                value={motor?.tmc_5160?.stallguard ?? 0}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_5160: {
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
                value={motor?.tmc_5160?.stallguard_debug ?? false}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_5160: {
                            stallguard_debug: Boolean(value)
                        }
                    })
                }
            />

            <TextField
                label="TOFF disable"
                value={motor?.tmc_5160?.toff_disable ?? 0}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_5160: {
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
                value={motor?.tmc_5160?.toff_stealthchop ?? 5}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_5160: {
                            toff_stealthchop: Number(value)
                        }
                    })
                }
            />

            <TextField
                label="TOFF coolstep"
                value={motor?.tmc_5160?.toff_coolstep ?? 3}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_5160: {
                            toff_coolstep: Number(value)
                        }
                    })
                }
            />

            <SelectField
                label="Run mode"
                value={
                    motor?.tmc_5160?.run_mode
                        ? motor?.tmc_5160?.run_mode + ""
                        : "StealthChop"
                }
                options={[
                    { name: "StealthChop", value: "StealthChop" },
                    { name: "CoolStep", value: "CoolStep" },
                    { name: "Stallguard", value: "Stallguard" }
                ]}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_5160: {
                            run_mode: value
                        }
                    })
                }
            />

            <SelectField
                label="Homing mode"
                value={
                    motor?.tmc_5160?.homing_mode
                        ? motor?.tmc_5160?.homing_mode + ""
                        : "StealthChop"
                }
                options={[
                    { name: "StealthChop", value: "StealthChop" },
                    { name: "CoolStep", value: "CoolStep" },
                    { name: "Stallguard", value: "Stallguard" }
                ]}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_5160: {
                            homing_mode: value
                        }
                    })
                }
            />

            <BooleanField
                label="Use enable"
                value={motor?.tmc_5160?.use_enable ?? false}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_5160: {
                            use_enable: Boolean(value)
                        }
                    })
                }
            />
            <TextField
                label="TPFD"
                value={motor?.tmc_5160?.tpfd ?? 4}
                setValue={(value) =>
                    updateMotorDriverValue({
                        tmc_5160: {
                            tpfd: Number(value)
                        }
                    })
                }
                helpText="Passive fast decay time for mid band resonance."
            />
        </>
    );
};

export default TMC5160;
