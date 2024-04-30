import React from "react";
import { Form } from "react-bootstrap";
import { Pin, PinConfig, SPI as SPIConfig } from "../../../model/Config";
import PinField from "../../../components/fields/PinField";
import { Board } from "../../../model/Boards";

type SPIProps = {
    board: Board;
    spi?: SPIConfig;
    setValue: (spiConfig?: SPIConfig) => void;
    usedPins: Map<string, PinConfig>;
};

const SPIGroup = ({ board, spi, setValue, usedPins }: SPIProps) => {
    return (
        <div style={{ marginBottom: "48px" }}>
            <h4>SPI</h4>
            <Form.Check
                type="switch"
                label="Include"
                checked={!!spi}
                onChange={() => {
                    if (spi) {
                        setValue(undefined);
                    } else {
                        setValue({
                            miso_pin: Pin.GPIO_19,
                            mosi_pin: Pin.GPIO_23,
                            sck_pin: Pin.GPIO_18
                        });
                    }
                }}
            ></Form.Check>

            {spi && (
                <>
                    <PinField
                        label="MISO Pin"
                        board={board}
                        value={PinConfig.fromString(spi?.miso_pin)}
                        setValue={(misoPin) => {
                            setValue({
                                ...spi,
                                ...{ miso_pin: misoPin.toString() }
                            });
                        }}
                        usedPins={usedPins}
                    />
                    <PinField
                        label="MOSI Pin"
                        board={board}
                        value={PinConfig.fromString(spi?.mosi_pin)}
                        setValue={(mosiPin) => {
                            setValue({
                                ...spi,
                                ...{ mosi_pin: mosiPin.toString() }
                            });
                        }}
                        usedPins={usedPins}
                    />
                    <PinField
                        label="SCK Pin"
                        board={board}
                        value={PinConfig.fromString(spi?.sck_pin)}
                        setValue={(sckPin) => {
                            setValue({
                                ...spi,
                                ...{ sck_pin: sckPin.toString() }
                            });
                        }}
                        usedPins={usedPins}
                    />
                </>
            )}
        </div>
    );
};

export default SPIGroup;
