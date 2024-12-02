import React from "react";
import { Form } from "react-bootstrap";
import { Pin, PinConfig, Probe } from "../../../model/Config";
import { Board } from "../../../model/Boards";
import PinField from "../../../components/fields/PinField";
import BooleanField from "../../../components/fields/BooleanField";
import CollapseSection from "../../../components/collapsesection/CollapseSection";

type ProbeProps = {
    board: Board;
    probe?: Probe;
    setValue: (probe?: Probe) => void;
    usedPins: Map<string, PinConfig>;
};

const ProbeGroup = ({ probe, setValue, board, usedPins }: ProbeProps) => {
    return (
        <div style={{ marginBottom: "48px" }}>
            <h4>
                Probe
                <Form.Check
                    type="switch"
                    style={{ display: "inline", marginLeft: "16px" }}
                    checked={!!probe}
                    onChange={() => {
                        if (probe) {
                            setValue(undefined);
                        } else {
                            setValue({
                                pin: Pin.NO_PIN,
                                toolsetter_pin: Pin.NO_PIN,
                                check_mode_start: false,
                                hard_stop: false
                            });
                        }
                    }}
                ></Form.Check>
            </h4>

            <CollapseSection show={!!probe}>
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
                <BooleanField
                    label="Hard stop"
                    value={probe?.hard_stop}
                    setValue={(value) => {
                        setValue({
                            ...probe,
                            ...{ hard_stop: Boolean(value) }
                        });
                    }}
                    helpText="If true the axis will do an hard stop rather than decelerate. This can be used with fragile bits that might break with the overtravel needed for decelration. It is likely to be less accurate at higher speeds where the motor might skip a few steps without decelaration."
                />
            </CollapseSection>
        </div>
    );
};

export default ProbeGroup;
