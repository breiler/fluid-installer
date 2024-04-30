import React from "react";
import { Form } from "react-bootstrap";
import { ControlConfig, PinConfig } from "../../../model/Config";
import PinField from "../../../components/fields/PinField";
import { Board } from "../../../model/Boards";

type ControlProps = {
    board: Board;
    control?: ControlConfig;
    setValue: (controlConfig?: ControlConfig) => void;
    usedPins: Map<string, PinConfig>;
};

const ControlGroup = ({ board, control, setValue, usedPins }: ControlProps) => {
    return (
        <div style={{ marginBottom: "48px" }}>
            <h4>Control</h4>
            <Form.Check
                type="switch"
                label="Include"
                checked={!!control}
                onChange={() => {
                    if (control) {
                        setValue(undefined);
                    } else {
                        setValue({});
                    }
                }}
            ></Form.Check>

            {control && (
                <>
                    <PinField
                        label="Safety Door Pin"
                        board={board}
                        value={PinConfig.fromString(control?.safety_door_pin)}
                        setValue={(pin) => {
                            setValue({
                                ...control,
                                ...{ safety_door_pin: pin.toString() }
                            });
                        }}
                        helpText="This is a feature that is typically used with an enclosure door. If the machine is running, it will quickly stop and enter a 'Door' mode"
                        usedPins={usedPins}
                    />
                    <PinField
                        label="Reset Pin"
                        board={board}
                        value={PinConfig.fromString(control?.reset_pin)}
                        setValue={(pin) => {
                            setValue({
                                ...control,
                                ...{ reset_pin: pin.toString() }
                            });
                        }}
                        usedPins={usedPins}
                    />
                    <PinField
                        label="Feed Hold Pin"
                        board={board}
                        value={PinConfig.fromString(control?.feed_hold_pin)}
                        setValue={(pin) => {
                            setValue({
                                ...control,
                                ...{ feed_hold_pin: pin.toString() }
                            });
                        }}
                        helpText="Pauses a job that is running. Paired with 'Cycle Start Pin' it will allow a machine to be paused and resumed with physical buttons."
                        usedPins={usedPins}
                    />
                    <PinField
                        label="Cycle Start Pin"
                        board={board}
                        value={PinConfig.fromString(control?.cycle_start_pin)}
                        setValue={(pin) => {
                            setValue({
                                ...control,
                                ...{ cycle_start_pin: pin.toString() }
                            });
                        }}
                        helpText="Resumes a job that is paused. Paired with 'Feed Hold Pin' it will allow a machine to be paused and resumed with physical buttons"
                        usedPins={usedPins}
                    />
                    <PinField
                        label="Macro 0 Pin"
                        board={board}
                        value={PinConfig.fromString(control?.macro0_pin)}
                        setValue={(pin) => {
                            setValue({
                                ...control,
                                ...{ macro0_pin: pin.toString() }
                            });
                        }}
                        usedPins={usedPins}
                    />
                    <PinField
                        label="Macro 1 Pin"
                        board={board}
                        value={PinConfig.fromString(control?.macro1_pin)}
                        setValue={(pin) => {
                            setValue({
                                ...control,
                                ...{ macro1_pin: pin.toString() }
                            });
                        }}
                        usedPins={usedPins}
                    />
                    <PinField
                        label="Macro 2 Pin"
                        board={board}
                        value={PinConfig.fromString(control?.macro2_pin)}
                        setValue={(pin) => {
                            setValue({
                                ...control,
                                ...{ macro2_pin: pin.toString() }
                            });
                        }}
                        usedPins={usedPins}
                    />
                    <PinField
                        label="Macro 3 Pin"
                        board={board}
                        value={PinConfig.fromString(control?.macro3_pin)}
                        setValue={(pin) => {
                            setValue({
                                ...control,
                                ...{ macro3_pin: pin.toString() }
                            });
                        }}
                        usedPins={usedPins}
                    />
                    <PinField
                        label="Fault Pin"
                        board={board}
                        value={PinConfig.fromString(control?.fault_pin)}
                        setValue={(pin) => {
                            setValue({
                                ...control,
                                ...{ fault_pin: pin.toString() }
                            });
                        }}
                        helpText="This will generate a hard stop. This could be used for things like stepper or servo drivers that have a fault pin."
                        usedPins={usedPins}
                    />
                    <PinField
                        label="E-stop Pin"
                        board={board}
                        value={PinConfig.fromString(control?.estop_pin)}
                        setValue={(pin) => {
                            setValue({
                                ...control,
                                ...{ estop_pin: pin.toString() }
                            });
                        }}
                        helpText="This can be used with an e-stop. A true e-stop should also cut the power."
                        usedPins={usedPins}
                    />
                </>
            )}
        </div>
    );
};

export default ControlGroup;
