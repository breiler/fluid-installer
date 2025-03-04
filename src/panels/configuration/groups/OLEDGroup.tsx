import React from "react";
import { Form } from "react-bootstrap";
import { OLEDConfig } from "../../../model/Config";
import { Board } from "../../../model/Boards";
import TextField from "../../../components/fields/TextField";
import CollapseSection from "../../../components/collapsesection/CollapseSection";

type OLEDProps = {
    board: Board;
    oled?: OLEDConfig;
    setValue: (oled?: OLEDConfig) => void;
};

const OLEDGroup = ({ oled, setValue }: OLEDProps) => {
    return (
        <div style={{ marginBottom: "48px" }}>
            <h4>
                OLED
                <Form.Check
                    type="switch"
                    style={{ display: "inline", marginLeft: "16px" }}
                    checked={!!oled}
                    onChange={() => {
                        if (oled) {
                            setValue(undefined);
                        } else {
                            setValue({
                                i2c_num: 0,
                                i2c_address: 60,
                                width: 128,
                                height: 64,
                                radio_delay_ms: 0
                            });
                        }
                    }}
                ></Form.Check>
            </h4>

            <CollapseSection show={!!oled}>
                <TextField
                    label="Address"
                    value={oled?.i2c_address}
                    setValue={(value) => {
                        setValue({
                            ...oled!,
                            ...{ i2c_address: +value.toString() }
                        });
                    }}
                />
                <TextField
                    label="Width"
                    value={oled?.width}
                    unit="px"
                    setValue={(value) => {
                        setValue({
                            ...oled!,
                            ...{ width: +value.toString() }
                        });
                    }}
                />
                <TextField
                    label="Height"
                    value={oled?.height}
                    unit="px"
                    setValue={(value) => {
                        setValue({
                            ...oled!,
                            ...{ height: +value.toString() }
                        });
                    }}
                />
                <TextField
                    label="Radio delay"
                    value={oled?.radio_delay_ms}
                    unit="ms"
                    setValue={(value) => {
                        setValue({
                            ...oled!,
                            ...{ radio_delay_ms: +value.toString() }
                        });
                    }}
                />
            </CollapseSection>
        </div>
    );
};

export default OLEDGroup;
