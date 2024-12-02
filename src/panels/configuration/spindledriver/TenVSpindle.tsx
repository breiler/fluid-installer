import React from "react";
import { Form } from "react-bootstrap";
import { Board } from "../../../model/Boards";
import { Config, PinConfig } from "../../../model/Config";
import BooleanField from "../../../components/fields/BooleanField";
import PinField from "../../../components/fields/PinField";
import TextField from "../../../components/fields/TextField";
import CollapseSection from "../../../components/collapsesection/CollapseSection";

type TenVSpindleProps = {
    board: Board;
    config?: Config;
    setValue: (config: Config) => void;
    updateSpindleDriverValue: (config: Config) => void;
    usedPins: Map<string, PinConfig>;
};

const TenVSpindle = ({
    board,
    config,
    setValue,
    updateSpindleDriverValue,
    usedPins
}: TenVSpindleProps) => {
    return (
        <div style={{ marginBottom: "48px" }}>
            <h4>
                10V
                <Form.Check
                    style={{ display: "inline", marginLeft: "16px" }}
                    type="switch"
                    checked={!!config?.["10V"]}
                    onChange={() => {
                        if (config?.["10V"]) {
                            setValue({
                                "10V": undefined
                            });
                        } else {
                            setValue({
                                "10V": {}
                            });
                        }
                    }}
                ></Form.Check>
            </h4>

            <CollapseSection show={!!config?.["10V"]}>
                <>
                    <PinField
                        label="Forward Pin"
                        board={board}
                        value={PinConfig.fromString(
                            config?.["10V"]?.forward_pin
                        )}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                "10V": {
                                    forward_pin: value.toString()
                                }
                            })
                        }
                        usedPins={usedPins}
                    />

                    <PinField
                        label="Reverse Pin"
                        board={board}
                        value={PinConfig.fromString(
                            config?.["10V"]?.reverse_pin
                        )}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                "10V": {
                                    reverse_pin: value.toString()
                                }
                            })
                        }
                        usedPins={usedPins}
                    />

                    <PinField
                        label="Output Pin"
                        board={board}
                        value={PinConfig.fromString(
                            config?.["10V"]?.output_pin
                        )}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                "10V": {
                                    output_pin: value.toString()
                                }
                            })
                        }
                        usedPins={usedPins}
                    />

                    <PinField
                        label="Enable Pin"
                        board={board}
                        value={PinConfig.fromString(
                            config?.["10V"]?.enable_pin
                        )}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                "10V": {
                                    enable_pin: value.toString()
                                }
                            })
                        }
                        usedPins={usedPins}
                    />

                    <PinField
                        label="Direction Pin"
                        board={board}
                        value={PinConfig.fromString(
                            config?.["10V"]?.direction_pin
                        )}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                "10V": {
                                    direction_pin: value.toString()
                                }
                            })
                        }
                        usedPins={usedPins}
                    />

                    <BooleanField
                        label="Disable with S0"
                        value={config?.["10V"]?.disable_with_s0 ?? false}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                "10V": {
                                    disable_with_s0: Boolean(value)
                                }
                            })
                        }
                        helpText="By default disable is controlled by M5. If you also want it to disable when speed is set to 0 (S0), set this to true."
                    />

                    <BooleanField
                        label="S0 with disable"
                        value={config?.["10V"]?.s0_with_disable ?? false}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                "10V": {
                                    s0_with_disable: Boolean(value)
                                }
                            })
                        }
                        helpText="By default the speed signal is controlled by the speed value. It will stay on even in M5 mode. If you want it to go to the S0 value with M5, set this to true."
                    />

                    <TextField
                        label="PWM"
                        value={config?.["10V"]?.pwm_hz ?? 5000}
                        unit={"Hz"}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                "10V": {
                                    pwm_hz: Number(value)
                                }
                            })
                        }
                    />

                    <TextField
                        label="Spin up time"
                        value={config?.["10V"]?.spinup_ms ?? 0}
                        unit={"ms"}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                "10V": {
                                    spinup_ms: Number(value)
                                }
                            })
                        }
                    />

                    <TextField
                        label="Spin down time"
                        value={config?.["10V"]?.spindown_ms ?? 0}
                        unit={"ms"}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                "10V": {
                                    spindown_ms: Number(value)
                                }
                            })
                        }
                    />

                    <TextField
                        label="Tool number"
                        value={config?.["10V"]?.tool_num ?? 0}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                "10V": {
                                    tool_num: Number(value)
                                }
                            })
                        }
                    />

                    <BooleanField
                        label="Off on alarm"
                        value={config?.["10V"]?.off_on_alarm ?? false}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                "10V": {
                                    off_on_alarm: Boolean(value)
                                }
                            })
                        }
                        helpText="Setting this to true will turn off the spindle whenever an alarm occurs. If you are using a safety door, you may want to enable this because the parking feature does not work in alarm mode."
                    />

                    <TextField
                        label="Speed map"
                        value={
                            config?.["10V"]?.speed_map ??
                            "0=0.000% 1000=0.000% 24000=100.000%"
                        }
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                "10V": {
                                    speed_map: value as string
                                }
                            })
                        }
                    />
                </>
            </CollapseSection>
        </div>
    );
};

export default TenVSpindle;
