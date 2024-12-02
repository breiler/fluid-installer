import React from "react";
import { Form } from "react-bootstrap";
import { PinConfig, I2ISO as I2ISOConfig, Pin } from "../../../model/Config";
import PinField from "../../../components/fields/PinField";
import { Board } from "../../../model/Boards";
import CollapseSection from "../../../components/collapsesection/CollapseSection";

type SPIProps = {
    board: Board;
    i2so?: I2ISOConfig;
    setValue: (i2so?: I2ISOConfig) => void;
    usedPins: Map<string, PinConfig>;
};

const I2SOGroup = ({ board, i2so, setValue, usedPins }: SPIProps) => {
    return (
        <div style={{ marginBottom: "48px" }}>
            <h4>
                I2SO
                <Form.Check
                    type="switch"
                    style={{ display: "inline", marginLeft: "16px" }}
                    checked={!!i2so}
                    onChange={() => {
                        if (i2so) {
                            setValue(undefined);
                        } else {
                            setValue({
                                bck_pin: Pin.GPIO_22,
                                data_pin: Pin.GPIO_21,
                                ws_pin: Pin.GPIO_17
                            });
                        }
                    }}
                ></Form.Check>
            </h4>

            <CollapseSection show={!!i2so}>
                <PinField
                    label="Bck Pin"
                    board={board}
                    value={PinConfig.fromString(i2so?.bck_pin)}
                    setValue={(value) => {
                        setValue({
                            ...i2so,
                            ...{ bck_pin: value.toString() }
                        });
                    }}
                    usedPins={usedPins}
                />
                <PinField
                    label="Data Pin"
                    board={board}
                    value={PinConfig.fromString(i2so?.data_pin)}
                    setValue={(value) => {
                        setValue({
                            ...i2so,
                            ...{ data_pin: value.toString() }
                        });
                    }}
                    usedPins={usedPins}
                />
                <PinField
                    label="WS Pin"
                    board={board}
                    value={PinConfig.fromString(i2so?.ws_pin)}
                    setValue={(value) => {
                        setValue({
                            ...i2so,
                            ...{ ws_pin: value.toString() }
                        });
                    }}
                    usedPins={usedPins}
                />
            </CollapseSection>
        </div>
    );
};

export default I2SOGroup;
