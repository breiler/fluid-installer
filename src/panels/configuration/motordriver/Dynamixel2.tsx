import React from "react";
import { Board } from "../../../model/Boards";
import { Motor } from "../../../model/Config";
import TextField from "../fields/TextField";

type Dynamixel2Props = {
    board: Board;
    motor: Motor;
    updateMotorDriverValue: (motor: Motor) => void;
};

const Dynamixel2 = ({ motor, updateMotorDriverValue }: Dynamixel2Props) => {
    return (
        <>
            <TextField
                label="ID"
                value={motor?.dynamixel2?.id ?? 1}
                setValue={(value) =>
                    updateMotorDriverValue({
                        dynamixel2: {
                            id: Number(value)
                        }
                    })
                }
            />

            <TextField
                label="Uart num"
                value={motor?.dynamixel2?.uart_num ?? 1}
                setValue={(value) =>
                    updateMotorDriverValue({
                        dynamixel2: {
                            uart_num: Number(value)
                        }
                    })
                }
            />

            <TextField
                label="Count min"
                value={motor?.dynamixel2?.count_min ?? 0}
                setValue={(value) =>
                    updateMotorDriverValue({
                        dynamixel2: {
                            count_min: Number(value)
                        }
                    })
                }
            />

            <TextField
                label="Count max"
                value={motor?.dynamixel2?.count_max ?? 100}
                setValue={(value) =>
                    updateMotorDriverValue({
                        dynamixel2: {
                            count_max: Number(value)
                        }
                    })
                }
            />
        </>
    );
};

export default Dynamixel2;
