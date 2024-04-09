import React from "react";
import { Form } from "react-bootstrap";
import { Board } from "../../../model/Boards";
import { Config, PinConfig } from "../../../model/Config";
import BooleanField from "../fields/BooleanField";
import PinField from "../fields/PinField";
import TextField from "../fields/TextField";

type BescSpindleProps = {
    board: Board;
    config?: Config;
    setValue: (config: Config) => void;
    updateSpindleDriverValue: (config: Config) => void;
    usedPins: Map<string, PinConfig>;
};

const BescSpindle = ({
    board,
    config,
    setValue,
    updateSpindleDriverValue,
    usedPins
}: BescSpindleProps) => {
    return (
        <div style={{ marginBottom: "48px" }}>
            <h4>BESC</h4>
            <Form.Check
                type="switch"
                label="Include"
                checked={!!config?.besc}
                onChange={() => {
                    if (config?.besc) {
                        setValue({
                            besc: undefined
                        });
                    } else {
                        setValue({
                            besc: {}
                        });
                    }
                }}
            ></Form.Check>

            {config?.besc && (
                <>
                    <PinField
                        label="Output Pin"
                        board={board}
                        value={PinConfig.fromString(config.besc.output_pin)}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                besc: {
                                    output_pin: value.toString()
                                }
                            })
                        }
                        usedPins={usedPins}
                    />

                    <PinField
                        label="Enable Pin"
                        board={board}
                        value={PinConfig.fromString(config.besc.enable_pin)}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                besc: {
                                    enable_pin: value.toString()
                                }
                            })
                        }
                        usedPins={usedPins}
                    />

                    <PinField
                        label="Direction Pin"
                        board={board}
                        value={PinConfig.fromString(config.besc.direction_pin)}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                besc: {
                                    direction_pin: value.toString()
                                }
                            })
                        }
                        usedPins={usedPins}
                    />

                    <BooleanField
                        label="Disable with S0"
                        value={config.besc.disable_with_s0 ?? false}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                besc: {
                                    disable_with_s0: Boolean(value)
                                }
                            })
                        }
                        helpText="By default disable is controlled by M5. If you also want it to disable when speed is set to 0 (S0), set this to true."
                    />

                    <BooleanField
                        label="S0 with disable"
                        value={config.besc.s0_with_disable ?? false}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                besc: {
                                    s0_with_disable: Boolean(value)
                                }
                            })
                        }
                        helpText="By default the speed signal is controlled by the speed value. It will stay on even in M5 mode. If you want it to go to the S0 value with M5, set this to true."
                    />

                    <TextField
                        label="PWM"
                        value={config.besc.pwm_hz ?? 5000}
                        unit={"Hz"}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                besc: {
                                    pwm_hz: Number(value)
                                }
                            })
                        }
                    />

                    <TextField
                        label="Spin up time"
                        value={config.besc.spinup_ms ?? 0}
                        unit={"ms"}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                besc: {
                                    spinup_ms: Number(value)
                                }
                            })
                        }
                    />

                    <TextField
                        label="Spin down time"
                        value={config.besc.spindown_ms ?? 0}
                        unit={"ms"}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                besc: {
                                    spindown_ms: Number(value)
                                }
                            })
                        }
                    />

                    <TextField
                        label="Tool number"
                        value={config.besc.tool_num ?? 0}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                besc: {
                                    tool_num: Number(value)
                                }
                            })
                        }
                    />

                    <BooleanField
                        label="Off on alarm"
                        value={config.besc.off_on_alarm ?? false}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                besc: {
                                    off_on_alarm: Boolean(value)
                                }
                            })
                        }
                        helpText="Setting this to true will turn off the spindle whenever an alarm occurs. If you are using a safety door, you may want to enable this because the parking feature does not work in alarm mode."
                    />

                    <TextField
                        label="Speed map"
                        value={
                            config.besc.speed_map ??
                            "0=0.000% 1000=0.000% 24000=100.000%"
                        }
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                besc: {
                                    speed_map: value as string
                                }
                            })
                        }
                    />

                    <TextField
                        label="Min pulse time"
                        value={config.besc.min_pulse_us ?? 900}
                        unit="µS"
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                besc: {
                                    min_pulse_us: Number(value)
                                }
                            })
                        }
                    />

                    <TextField
                        label="Max pulse time"
                        value={config.besc.max_pulse_us ?? 2200}
                        unit="µS"
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                besc: {
                                    max_pulse_us: Number(value)
                                }
                            })
                        }
                    />
                </>
            )}
        </div>
    );
};

export default BescSpindle;
