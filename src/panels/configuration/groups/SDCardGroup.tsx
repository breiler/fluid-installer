import React from "react";
import { Pin, PinConfig, SDCard } from "../../../model/Config";
import PinField from "../../../components/fields/PinField";
import { Board } from "../../../model/Boards";
import { Form } from "react-bootstrap";
import CollapseSection from "../../../components/collapsesection/CollapseSection";

type SPIProps = {
    board: Board;
    sdcard?: SDCard;
    setValue: (sdcard?: SDCard) => void;
    usedPins: Map<string, PinConfig>;
};

const SDCardGroup = ({ board, sdcard, setValue, usedPins }: SPIProps) => {
    return (
        <div style={{ marginBottom: "48px" }}>
            <h4>
                SD Card
                <Form.Check
                    type="switch"
                    style={{ display: "inline", marginLeft: "16px" }}
                    checked={!!sdcard}
                    onChange={() => {
                        if (sdcard) {
                            setValue(undefined);
                        } else {
                            setValue({
                                card_detect_pin: Pin.NO_PIN,
                                cs_pin: Pin.GPIO_5
                            });
                        }
                    }}
                ></Form.Check>
            </h4>

            <CollapseSection show={!!sdcard}>
                <PinField
                    label="Card Detect Pin"
                    board={board}
                    value={PinConfig.fromString(sdcard?.card_detect_pin)}
                    setValue={(value) => {
                        setValue({
                            ...sdcard,
                            ...{ card_detect_pin: value.toString() }
                        });
                    }}
                    usedPins={usedPins}
                />
                <PinField
                    label="CS Pin"
                    board={board}
                    value={PinConfig.fromString(sdcard?.cs_pin)}
                    setValue={(value) => {
                        setValue({
                            ...sdcard,
                            ...{ cs_pin: value.toString() }
                        });
                    }}
                    usedPins={usedPins}
                />
            </CollapseSection>
        </div>
    );
};

export default SDCardGroup;
