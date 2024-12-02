import React from "react";
import { Form } from "react-bootstrap";
import { PinConfig, I2C0Config, Pin } from "../../../model/Config";
import PinField from "../../../components/fields/PinField";
import { Board } from "../../../model/Boards";
import CollapseSection from "../../../components/collapsesection/CollapseSection";

type I2C0Props = {
    board: Board;
    i2c?: I2C0Config;
    setValue: (i2c?: I2C0Config) => void;
    usedPins: Map<string, PinConfig>;
};

const I2C0Group = ({ board, i2c, setValue, usedPins }: I2C0Props) => {
    return (
        <div style={{ marginBottom: "48px" }}>
            <h4>
                I2C
                <Form.Check
                    type="switch"
                    style={{ display: "inline", marginLeft: "16px" }}
                    checked={!!i2c}
                    onChange={() => {
                        if (i2c) {
                            setValue(undefined);
                        } else {
                            setValue({
                                sda_pin: Pin.GPIO_14,
                                scl_pin: Pin.GPIO_13
                            });
                        }
                    }}
                ></Form.Check>
            </h4>

            <CollapseSection show={!!i2c}>
                <PinField
                    label="SDA Pin"
                    board={board}
                    value={PinConfig.fromString(i2c?.sda_pin)}
                    setValue={(value) => {
                        setValue({
                            ...i2c,
                            ...{ sda_pin: value.toString() }
                        });
                    }}
                    usedPins={usedPins}
                />
                <PinField
                    label="SCL Pin"
                    board={board}
                    value={PinConfig.fromString(i2c?.scl_pin)}
                    setValue={(value) => {
                        setValue({
                            ...i2c,
                            ...{ scl_pin: value.toString() }
                        });
                    }}
                    usedPins={usedPins}
                />
            </CollapseSection>
        </div>
    );
};

export default I2C0Group;
