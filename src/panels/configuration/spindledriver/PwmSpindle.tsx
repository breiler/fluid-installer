import React from "react";
import { Form } from "react-bootstrap";
import { Board } from "../../../model/Boards";
import { Config, PinConfig } from "../../../model/Config";
import BooleanField from "../fields/BooleanField";
import PinField from "../fields/PinField";
import TextField from "../fields/TextField";

type PwmSpindleProps = {
    board: Board;
    config?: Config;
    setValue: (config: Config) => void;
    updateSpindleDriverValue: (config: Config) => void;
};

const PwmSpindle = ({
    board,
    config,
    setValue,
    updateSpindleDriverValue
}: PwmSpindleProps) => {
    return (
        <div style={{ marginBottom: "48px" }}>
            <h4>PWM</h4>
            <Form.Check
                type="switch"
                label="Include"
                checked={!!config?.PWM}
                onChange={() => {
                    if (!!config?.PWM) {
                        setValue({
                            PWM: undefined
                        });
                    } else {
                        setValue({
                            PWM: {}
                        });
                    }
                }}></Form.Check>

            {config?.PWM && (
                <>
                    <PinField
                        label="Output Pin"
                        board={board}
                        value={PinConfig.fromString(config.PWM.output_pin)}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                PWM: {
                                    output_pin: value.toString()
                                }
                            })
                        }
                    />

                    <PinField
                        label="Enable Pin"
                        board={board}
                        value={PinConfig.fromString(config.PWM.enable_pin)}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                PWM: {
                                    enable_pin: value.toString()
                                }
                            })
                        }
                    />

                    <PinField
                        label="Direction Pin"
                        board={board}
                        value={PinConfig.fromString(config.PWM.direction_pin)}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                PWM: {
                                    direction_pin: value.toString()
                                }
                            })
                        }
                    />

                    <BooleanField
                        label="Disable with S0"
                        value={config.PWM.disable_with_s0 ?? false}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                PWM: {
                                    disable_with_s0: Boolean(value)
                                }
                            })
                        }
                        helpText="By default disable is controlled by M5. If you also want it to disable when speed is set to 0 (S0), set this to true."
                    />

                    <BooleanField
                        label="S0 with disable"
                        value={config.PWM.s0_with_disable ?? false}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                PWM: {
                                    s0_with_disable: Boolean(value)
                                }
                            })
                        }
                        helpText="By default the speed signal is controlled by the speed value. It will stay on even in M5 mode. If you want it to go to the S0 value with M5, set this to true."
                    />

                    <TextField
                        label="PWM"
                        value={config.PWM.pwm_hz ?? 5000}
                        unit={"Hz"}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                PWM: {
                                    pwm_hz: Number(value)
                                }
                            })
                        }
                    />

                    <TextField
                        label="Spin up time"
                        value={config.PWM.spinup_ms ?? 0}
                        unit={"ms"}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                PWM: {
                                    spinup_ms: Number(value)
                                }
                            })
                        }
                    />

                    <TextField
                        label="Spin down time"
                        value={config.PWM.spindown_ms ?? 0}
                        unit={"ms"}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                PWM: {
                                    spindown_ms: Number(value)
                                }
                            })
                        }
                    />

                    <TextField
                        label="Tool number"
                        value={config.PWM.tool_num ?? 0}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                PWM: {
                                    tool_num: Number(value)
                                }
                            })
                        }
                    />

                    <BooleanField
                        label="Off on alarm"
                        value={config.PWM.off_on_alarm ?? false}
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                PWM: {
                                    off_on_alarm: Boolean(value)
                                }
                            })
                        }
                        helpText="Setting this to true will turn off the spindle whenever an alarm occurs. If you are using a safety door, you may want to enable this because the parking feature does not work in alarm mode."
                    />

                    <TextField
                        label="Speed map"
                        value={
                            config.PWM.speed_map ??
                            "0=0.000% 1000=0.000% 24000=100.000%"
                        }
                        setValue={(value) =>
                            updateSpindleDriverValue({
                                PWM: {
                                    speed_map: value as string
                                }
                            })
                        }
                    />
                </>
            )}
        </div>
    );
};

export default PwmSpindle;
