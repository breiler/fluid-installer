import React from "react";
import { Pin, PinConfig, SDCard } from "../../../model/Config";
import PinField from "../fields/PinField";
import { Board } from "../../../model/Boards";
import { Form } from "react-bootstrap";

type SPIProps = {
    board: Board;
    sdcard?: SDCard;
    setValue: (sdcard?: SDCard) => void;
};

const SDCardGroup = ({ board, sdcard, setValue }: SPIProps) => {
    return (
        <>
            <h4>SD Card</h4>
            <Form.Check
                type="switch"
                label="Include"
                checked={!!sdcard}
                onChange={() => {
                    if (!!sdcard) {
                        setValue(undefined);
                    } else {
                        setValue({
                            card_detect_pin: Pin.NO_PIN,
                            cs_pin: Pin.GPIO_5,
                        });
                    }
                }}></Form.Check>

            {sdcard && (
                <>
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
                    />
                    <br />
                    <br />
                </>
            )}
        </>
    );
};

export default SDCardGroup;
