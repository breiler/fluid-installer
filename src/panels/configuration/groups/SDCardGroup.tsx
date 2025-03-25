import React from "react";
import {
    Pin,
    PinConfig,
    SDCard,
    SPI as SPIConfig
} from "../../../model/Config";
import PinField from "../../../components/fields/PinField";
import { Board } from "../../../model/Boards";
import { Form } from "react-bootstrap";
import CollapseSection from "../../../components/collapsesection/CollapseSection";

type SPIProps = {
    board: Board;
    spi?: SPIConfig;
    sdcard?: SDCard;
    setValue: (spi?: SPIConfig, sdcard?: SDCard) => void;
    usedPins: Map<string, PinConfig>;
};

const SDCardGroup = ({ board, spi, sdcard, setValue, usedPins }: SPIProps) => {
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
                            setValue(undefined, undefined);
                        } else {
                            setValue(
                                spi ?? {
                                    miso_pin: Pin.GPIO_19,
                                    mosi_pin: Pin.GPIO_23,
                                    sck_pin: Pin.GPIO_18
                                },
                                {
                                    card_detect_pin: Pin.NO_PIN,
                                    cs_pin: Pin.GPIO_5
                                }
                            );
                        }
                    }}
                ></Form.Check>
            </h4>

            <CollapseSection show={!!sdcard}>
                <PinField
                    label="MISO Pin"
                    board={board}
                    value={PinConfig.fromString(spi?.miso_pin)}
                    setValue={(misoPin) => {
                        setValue(
                            {
                                ...spi,
                                ...{ miso_pin: misoPin.toString() }
                            },
                            sdcard
                        );
                    }}
                    usedPins={usedPins}
                />
                <PinField
                    label="MOSI Pin"
                    board={board}
                    value={PinConfig.fromString(spi?.mosi_pin)}
                    setValue={(mosiPin) => {
                        setValue(
                            {
                                ...spi,
                                ...{ mosi_pin: mosiPin.toString() }
                            },
                            sdcard
                        );
                    }}
                    usedPins={usedPins}
                />
                <PinField
                    label="SCK Pin"
                    board={board}
                    value={PinConfig.fromString(spi?.sck_pin)}
                    setValue={(sckPin) => {
                        setValue(
                            {
                                ...spi,
                                ...{ sck_pin: sckPin.toString() }
                            },
                            sdcard
                        );
                    }}
                    usedPins={usedPins}
                />

                <PinField
                    label="Card Detect Pin"
                    board={board}
                    value={PinConfig.fromString(sdcard?.card_detect_pin)}
                    setValue={(value) => {
                        setValue(spi, {
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
                        setValue(spi, {
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
