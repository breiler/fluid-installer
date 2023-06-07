import React, { useEffect, useMemo, useState } from "react";
import { PinConfig, Motor } from "../../../model/Config";
import PinField from "../fields/PinField";
import { Board } from "../../../model/Boards";
import SelectField from "../fields/SelectField";

type MotorDriverProps = {
    board: Board;
    motor?: Motor;
    setValue: (motor?: Motor) => void;
};

enum DriverType {
    NONE = "none",
    STANDARD_STEPPER = "standard_stepper",
    STEPSTICK = "stepstick",
    TMC_2130 = "tmc_2130",
    TMC_2208 = "tmc_2208",
    TMC_2209 = "tmc_2209",
    TMC_5160 = "tmc_5160",
    TMC_5170 = "tmc_5170",
    RC_SERVO = "rc_servo",
    SOLENOID = "solenoid",
    DYNAMIXEL2 = "dynamixel2"
}

type Props = Record<string, any>;

const deepMerge = (target: Props, ...sources: Props[]): Props => {
    if (!sources.length) {
        return target;
    }

    Object.entries(sources.shift() ?? []).forEach(([key, value]) => {
        if (value) {
            if (!target[key]) {
                Object.assign(target, { [key]: {} });
            }

            if (
                value.constructor === Object ||
                (value.constructor === Array &&
                    value.find((v) => v.constructor === Object))
            ) {
                deepMerge(target[key], value);
            } else if (value.constructor === Array) {
                Object.assign(target, {
                    [key]: value.find((v) => v.constructor === Array)
                        ? target[key].concat(value)
                        : [...new Set([...target[key], ...value])]
                });
            } else {
                Object.assign(target, { [key]: value });
            }
        }
    });

    return target;
};

const MotorDriverGroup = ({ board, motor, setValue }: MotorDriverProps) => {
    const [driverType, setDriverType] = useState<string>();

    useEffect(() => {
        if (motor?.standard_stepper) {
            setDriverType(DriverType.STANDARD_STEPPER);
        } else if (motor?.stepstick) {
            setDriverType(DriverType.STEPSTICK);
        } else if (motor?.tmc_2130) {
            setDriverType(DriverType.TMC_2130);
        } else if (motor?.tmc_2208) {
            setDriverType(DriverType.TMC_2208);
        } else if (motor?.tmc_2209) {
            setDriverType(DriverType.TMC_2209);
        } else if (motor?.tmc_5160) {
            setDriverType(DriverType.TMC_5160);
        } else if (motor?.rc_servo) {
            setDriverType(DriverType.RC_SERVO);
        } else if (motor?.solenoid) {
            setDriverType(DriverType.SOLENOID);
        } else if (motor?.dynamixel2) {
            setDriverType(DriverType.DYNAMIXEL2);
        }
    }, [motor]);

    useEffect(() => {
        if (driverType && motor) {
            updateMotorDriverValue(motor);
        }
    }, [driverType]);

    const updateMotorDriverValue = (config: Motor) => {
        const newMotorConfig: Motor = deepMerge(motor!, config);

        // Remove old configs
        if (driverType != DriverType.STANDARD_STEPPER) {
            delete newMotorConfig.standard_stepper;
        }

        if (driverType != DriverType.STEPSTICK) {
            delete newMotorConfig.stepstick;
        }

        if (driverType !== DriverType.TMC_2130) {
            delete newMotorConfig.tmc_2130;
        }

        if (driverType !== DriverType.TMC_2208) {
            delete newMotorConfig.tmc_2208;
        }

        if (driverType !== DriverType.TMC_2209) {
            delete newMotorConfig.tmc_2209;
        }

        if (driverType !== DriverType.TMC_5160) {
            delete newMotorConfig.tmc_5160;
        }

        if (driverType !== DriverType.RC_SERVO) {
            delete newMotorConfig.rc_servo;
        }

        if (driverType !== DriverType.SOLENOID) {
            delete newMotorConfig.solenoid;
        }

        if (driverType !== DriverType.DYNAMIXEL2) {
            delete newMotorConfig.dynamixel2;
        }

        setValue(newMotorConfig);
    };

    return (
        <>
            <SelectField
                label="Driver"
                setValue={setDriverType}
                value={driverType}
                options={[
                    {
                        name: "None",
                        value: DriverType.NONE
                    },
                    {
                        name: "Standard stepper",
                        value: DriverType.STANDARD_STEPPER
                    },
                    {
                        name: "Stepstick",
                        value: DriverType.STEPSTICK
                    },
                    {
                        name: "TMC 2130",
                        value: DriverType.TMC_2130
                    },
                    {
                        name: "TMC 2208",
                        value: DriverType.TMC_2208
                    },
                    {
                        name: "TMC 2209",
                        value: DriverType.TMC_2209
                    },
                    {
                        name: "TMC 5160",
                        value: DriverType.TMC_5160
                    },
                    {
                        name: "RC Servo",
                        value: DriverType.RC_SERVO
                    },
                    {
                        name: "Solenoid",
                        value: DriverType.SOLENOID
                    },
                    {
                        name: "Dynamixel2",
                        value: DriverType.DYNAMIXEL2
                    }
                ]}
            />

            {driverType === DriverType.STANDARD_STEPPER && (
                <>
                    <PinField
                        label="Step pin"
                        board={board}
                        value={PinConfig.fromString(
                            motor?.standard_stepper?.step_pin
                        )}
                        setValue={(value) =>
                            updateMotorDriverValue({
                                standard_stepper: {
                                    step_pin: value.toString()
                                }
                            })
                        }
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
                    />
                </>
            )}

            {driverType === DriverType.STEPSTICK && (
                <>
                    <PinField
                        label="Step pin"
                        board={board}
                        value={PinConfig.fromString(motor?.stepstick?.step_pin)}
                        setValue={(value) =>
                            updateMotorDriverValue({
                                stepstick: {
                                    step_pin: value.toString()
                                }
                            })
                        }
                    />

                    <PinField
                        label="Direction pin"
                        board={board}
                        value={PinConfig.fromString(
                            motor?.stepstick?.direction_pin
                        )}
                        setValue={(value) =>
                            updateMotorDriverValue({
                                stepstick: {
                                    direction_pin: value.toString()
                                }
                            })
                        }
                    />

                    <PinField
                        label="Disable pin"
                        board={board}
                        value={PinConfig.fromString(
                            motor?.stepstick?.disable_pin
                        )}
                        setValue={(value) =>
                            updateMotorDriverValue({
                                stepstick: {
                                    disable_pin: value.toString()
                                }
                            })
                        }
                    />

                    <PinField
                        label="MS1 pin"
                        board={board}
                        value={PinConfig.fromString(motor?.stepstick?.ms1_pin)}
                        setValue={(value) =>
                            updateMotorDriverValue({
                                stepstick: {
                                    ms1_pin: value.toString()
                                }
                            })
                        }
                    />

                    <PinField
                        label="MS2 pin"
                        board={board}
                        value={PinConfig.fromString(motor?.stepstick?.ms2_pin)}
                        setValue={(value) =>
                            updateMotorDriverValue({
                                stepstick: {
                                    ms2_pin: value.toString()
                                }
                            })
                        }
                    />

                    <PinField
                        label="MS3 pin"
                        board={board}
                        value={PinConfig.fromString(motor?.stepstick?.ms3_pin)}
                        setValue={(value) =>
                            updateMotorDriverValue({
                                stepstick: {
                                    ms3_pin: value.toString()
                                }
                            })
                        }
                    />
                </>
            )}
        </>
    );
};

export default MotorDriverGroup;