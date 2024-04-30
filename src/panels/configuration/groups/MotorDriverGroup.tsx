import React, { useEffect, useState } from "react";
import { Motor, PinConfig } from "../../../model/Config";
import { Board } from "../../../model/Boards";
import SelectField from "../../../components/fields/SelectField";
import StandardStepper from "../motordriver/StandardStepper";
import Stepstick from "../motordriver/Stepstick";
import TMC2130 from "../motordriver/TMC2130";
import TMC2208 from "../motordriver/TMC2208";
import TMC2209 from "../motordriver/TMC2209";
import TMC5160 from "../motordriver/TMC5160";
import RCServo from "../motordriver/RCServo";
import Solenoid from "../motordriver/Solenoid";
import Dynamixel2 from "../motordriver/Dynamixel2";
import { deepMerge } from "../../../utils/utils";

type MotorDriverProps = {
    board: Board;
    motor?: Motor;
    setValue: (motor?: Motor) => void;
    usedPins: Map<string, PinConfig>;
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

const MotorDriverGroup = ({
    board,
    motor,
    setValue,
    usedPins
}: MotorDriverProps) => {
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
                <StandardStepper
                    board={board}
                    motor={motor ?? {}}
                    updateMotorDriverValue={updateMotorDriverValue}
                    usedPins={usedPins}
                />
            )}

            {driverType === DriverType.STEPSTICK && (
                <Stepstick
                    board={board}
                    motor={motor ?? {}}
                    updateMotorDriverValue={updateMotorDriverValue}
                    usedPins={usedPins}
                />
            )}

            {driverType === DriverType.TMC_2130 && (
                <TMC2130
                    board={board}
                    motor={motor ?? {}}
                    updateMotorDriverValue={updateMotorDriverValue}
                    usedPins={usedPins}
                />
            )}

            {driverType === DriverType.TMC_2208 && (
                <TMC2208
                    board={board}
                    motor={motor ?? {}}
                    updateMotorDriverValue={updateMotorDriverValue}
                    usedPins={usedPins}
                />
            )}

            {driverType === DriverType.TMC_2209 && (
                <TMC2209
                    board={board}
                    motor={motor ?? {}}
                    updateMotorDriverValue={updateMotorDriverValue}
                    usedPins={usedPins}
                />
            )}

            {driverType === DriverType.TMC_5160 && (
                <TMC5160
                    board={board}
                    motor={motor ?? {}}
                    updateMotorDriverValue={updateMotorDriverValue}
                    usedPins={usedPins}
                />
            )}

            {driverType === DriverType.RC_SERVO && (
                <RCServo
                    board={board}
                    motor={motor ?? {}}
                    updateMotorDriverValue={updateMotorDriverValue}
                    usedPins={usedPins}
                />
            )}

            {driverType === DriverType.SOLENOID && (
                <Solenoid
                    board={board}
                    motor={motor ?? {}}
                    updateMotorDriverValue={updateMotorDriverValue}
                    usedPins={usedPins}
                />
            )}

            {driverType === DriverType.DYNAMIXEL2 && (
                <Dynamixel2
                    board={board}
                    motor={motor ?? {}}
                    updateMotorDriverValue={updateMotorDriverValue}
                />
            )}
        </>
    );
};

export default MotorDriverGroup;
