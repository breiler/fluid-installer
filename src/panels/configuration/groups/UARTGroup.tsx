import React from "react";
import { Form } from "react-bootstrap";
import { PinConfig, Pin, Uart } from "../../../model/Config";
import PinField from "../../../components/fields/PinField";
import { Board } from "../../../model/Boards";
import CollapseSection from "../../../components/collapsesection/CollapseSection";
import TextField from "../../../components/fields/TextField";
import SelectField from "../../../components/fields/SelectField";

type SPIProps = {
    board: Board;
    uart?: Uart;
    uartName: string;
    setValue: (config?: Uart) => void;
    usedPins: Map<string, PinConfig>;
};

const UARTGroup = ({ board, uart, uartName, setValue, usedPins }: SPIProps) => {
    return (
        <div style={{ marginBottom: "48px" }}>
            <h4>
                {uartName}
                <Form.Check
                    type="switch"
                    style={{ display: "inline", marginLeft: "16px" }}
                    checked={!!uart}
                    onChange={() => {
                        if (uart) {
                            setValue(undefined);
                        } else {
                            setValue({
                                txd_pin: Pin.NO_PIN,
                                rxd_pin: Pin.NO_PIN,
                                rts_pin: Pin.NO_PIN,
                                baud: 115200,
                                mode: "8N1"
                            });
                        }
                    }}
                ></Form.Check>
            </h4>

            <CollapseSection show={!!uart}>
                <PinField
                    label="TXD Pin"
                    board={board}
                    value={PinConfig.fromString(uart?.txd_pin)}
                    setValue={(value) => {
                        setValue({
                            ...uart,
                            ...{ txd_pin: value.toString() }
                        });
                    }}
                    usedPins={usedPins}
                />
                <PinField
                    label="RXD Pin"
                    board={board}
                    value={PinConfig.fromString(uart?.rxd_pin)}
                    setValue={(value) => {
                        setValue({
                            ...uart,
                            ...{ rxd_pin: value.toString() }
                        });
                    }}
                    usedPins={usedPins}
                />
                <PinField
                    label="RTS Pin"
                    board={board}
                    value={PinConfig.fromString(uart?.rts_pin)}
                    setValue={(value) => {
                        setValue({
                            ...uart,
                            ...{ rts_pin: value.toString() }
                        });
                    }}
                    usedPins={usedPins}
                />

                <SelectField
                    label="Baud"
                    value={uart?.baud + ""}
                    setValue={(value) => {
                        setValue({
                            ...uart!,
                            ...{ baud: +value.toString() }
                        });
                    }}
                    options={[
                        {
                            name: "115200",
                            value: "115200"
                        },
                        {
                            name: "230400",
                            value: "230400"
                        },
                        {
                            name: "460800",
                            value: "460800"
                        },
                        {
                            name: "921600",
                            value: "921600"
                        }
                    ]}
                />

                <TextField
                    label="Mode"
                    value={uart?.mode}
                    setValue={(value) => {
                        setValue({
                            ...uart!,
                            ...{ mode: value.toString() }
                        });
                    }}
                />
            </CollapseSection>
        </div>
    );
};

export default UARTGroup;
