import React from "react";
import { Form } from "react-bootstrap";
import { Board } from "../../../model/Boards";
import { Config, PinConfig } from "../../../model/Config";
import BooleanField from "../../../components/fields/BooleanField";
import PinField from "../../../components/fields/PinField";
import TextField from "../../../components/fields/TextField";
import CollapseSection from "../../../components/collapsesection/CollapseSection";

type LaserSpindleProps = {
    board: Board;
    config?: Config;
    setValue: (config: Config) => void;
    updateSpindleDriverValue: (config: Config) => void;
    usedPins: Map<string, PinConfig>;
};

const LaserSpindle = ({
    board,
    config,
    setValue,
    updateSpindleDriverValue,
    usedPins
}: LaserSpindleProps) => {
    return (
        <div style={{ marginBottom: "48px" }}>
            <h4>
                Laser
                <Form.Check
                    style={{ display: "inline", marginLeft: "16px" }}
                    type="switch"
                    checked={!!config?.Laser}
                    onChange={() => {
                        if (config?.Laser) {
                            setValue({
                                Laser: undefined
                            });
                        } else {
                            setValue({
                                Laser: {}
                            });
                        }
                    }}
                ></Form.Check>
            </h4>

            <CollapseSection show={!!config?.Laser}>
                <PinField
                    label="Output Pin"
                    board={board}
                    value={PinConfig.fromString(config?.Laser?.output_pin)}
                    setValue={(value) =>
                        updateSpindleDriverValue({
                            Laser: {
                                output_pin: value.toString()
                            }
                        })
                    }
                    usedPins={usedPins}
                />

                <PinField
                    label="Enable Pin"
                    board={board}
                    value={PinConfig.fromString(config?.Laser?.enable_pin)}
                    setValue={(value) =>
                        updateSpindleDriverValue({
                            Laser: {
                                enable_pin: value.toString()
                            }
                        })
                    }
                    usedPins={usedPins}
                />

                <BooleanField
                    label="Disable with S0"
                    value={config?.Laser?.disable_with_s0 ?? false}
                    setValue={(value) =>
                        updateSpindleDriverValue({
                            Laser: {
                                disable_with_s0: Boolean(value)
                            }
                        })
                    }
                    helpText="By default disable is controlled by M5. If you also want it to disable when speed is set to 0 (S0), set this to true."
                />

                <BooleanField
                    label="S0 with disable"
                    value={config?.Laser?.s0_with_disable ?? false}
                    setValue={(value) =>
                        updateSpindleDriverValue({
                            Laser: {
                                s0_with_disable: Boolean(value)
                            }
                        })
                    }
                    helpText="By default the speed signal is controlled by the speed value. It will stay on even in M5 mode. If you want it to go to the S0 value with M5, set this to true."
                />

                <TextField
                    label="PWM"
                    value={config?.Laser?.pwm_hz ?? 5000}
                    unit={"Hz"}
                    setValue={(value) =>
                        updateSpindleDriverValue({
                            Laser: {
                                pwm_hz: Number(value)
                            }
                        })
                    }
                />

                <TextField
                    label="Tool number"
                    value={
                        Number.isNaN(config?.Laser?.tool_num) ||
                        !config?.Laser?.tool_num
                            ? 0
                            : config?.Laser?.tool_num
                    }
                    setValue={(value) =>
                        updateSpindleDriverValue({
                            Laser: {
                                tool_num: Number(value)
                            }
                        })
                    }
                />

                <BooleanField
                    label="Off on alarm"
                    value={config?.Laser?.off_on_alarm ?? false}
                    setValue={(value) =>
                        updateSpindleDriverValue({
                            Laser: {
                                off_on_alarm: Boolean(value)
                            }
                        })
                    }
                    helpText="Setting this to true will turn off the spindle whenever an alarm occurs. If you are using a safety door, you may want to enable this because the parking feature does not work in alarm mode."
                />

                <TextField
                    label="Speed map"
                    value={
                        config?.Laser?.speed_map ??
                        "0=0.000% 1000=0.000% 24000=100.000%"
                    }
                    setValue={(value) =>
                        updateSpindleDriverValue({
                            Laser: {
                                speed_map: value as string
                            }
                        })
                    }
                />
            </CollapseSection>
        </div>
    );
};

export default LaserSpindle;
