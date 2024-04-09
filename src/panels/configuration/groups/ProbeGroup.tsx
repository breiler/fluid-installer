import React from "react";
import { Form } from "react-bootstrap";
import { Pin, PinConfig, Probe } from "../../../model/Config";
import { Board } from "../../../model/Boards";
import PinField from "../fields/PinField";
import BooleanField from "../fields/BooleanField";

type ProbeProps = {
    board: Board;
    probe?: Probe;
    setValue: (probe?: Probe) => void;
    usedPins: Map<string, PinConfig>;
};

const ProbeGroup = ({ probe, setValue, board, usedPins }: ProbeProps) => {
    return (
        <div style={{ marginBottom: "48px" }}>
            <h4>Probe</h4>
            <Form.Check
                type="switch"
                label="Include"
                checked={!!probe}
                onChange={() => {
                    if (probe) {
                        setValue(undefined);
                    } else {
                        setValue({
                            pin: Pin.NO_PIN,
                            toolsetter_pin: Pin.NO_PIN,
                            check_mode_start: false
                        });
                    }
                }}
            ></Form.Check>

            {probe && (
                <>
                    <PinField
                        board={board}
                        label="Probe pin"
                        value={PinConfig.fromString(probe?.pin)}
                        setValue={(value) => {
                            setValue({
                                ...probe,
                                ...{ pin: value.toString() }
                            });
                        }}
                        usedPins={usedPins}
                    />
                    <PinField
                        board={board}
                        label="Tool setter pin"
                        value={PinConfig.fromString(probe?.toolsetter_pin)}
                        setValue={(value) => {
                            setValue({
                                ...probe,
                                ...{ toolsetter_pin: value.toString() }
                            });
                        }}
                        helpText="This is an optional second probe"
                        usedPins={usedPins}
                    />
                    <BooleanField
                        label="Check mode start"
                        value={probe?.check_mode_start}
                        setValue={(value) => {
                            setValue({
                                ...probe,
                                ...{ check_mode_start: Boolean(value) }
                            });
                        }}
                        helpText="This will force a probe check before a probe is started"
                    />
                </>
            )}
        </div>
    );
};

export default ProbeGroup;
