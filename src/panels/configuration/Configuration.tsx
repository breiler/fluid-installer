import React, { useEffect, useState } from "react";
import { Config, PinConfig, getUsedPins } from "../../model/Config";
import { Container } from "react-bootstrap";
import TextField from "../../components/fields/TextField";
import SelectField from "../../components/fields/SelectField";
import jsYaml from "js-yaml";
import AxesGroup from "./groups/AxesGroup";
import { Boards } from "../../model/Boards";
import SPIGroup from "./groups/SPIGroup";
import I2SOGroup from "./groups/I2SOGroup";
import SDCardGroup from "./groups/SDCardGroup";
import Editor from "../../components/editor/Editor";
import SpindleDriverGroup from "./groups/SpindleDriverGroup";
import I2CGroup from "./groups/I2CGroup";
import OLEDGroup from "./groups/OLEDGroup";
import { deepMerge, fileDataToConfig } from "../../utils/utils";
import ControlGroup from "./groups/ControlGroup";
import ProbeGroup from "./groups/ProbeGroup";
import "./Configuration.scss";
import TextAreaField from "../../components/fields/TextAreaField";
import UARTGroup from "./groups/UARTGroup";

const DEFAULT_CONFIG: Config = {};

export enum ConfigurationTab {
    GENERAL,
    AXES,
    IO,
    SPINDLE,
    SOURCE
}

type ConfigurationProps = {
    currentTab?: ConfigurationTab;
    onClose: () => void;
    value: string;
    onChange: (value: string, hasErrors?: boolean) => void;
};

const Configuration = ({
    currentTab = ConfigurationTab.GENERAL,
    value,
    onChange
}: ConfigurationProps) => {
    const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
    const [usedPins, setUsedPins] = useState<Map<string, PinConfig>>(new Map());

    useEffect(() => {
        updateValue(value);
    }, [value]);

    useEffect(() => {
        setUsedPins(getUsedPins(config));
    }, [config]);

    const appendConfig = (conf) => {
        const newConfig = deepMerge(config, conf);
        setConfig(newConfig);

        // No compat mode will not try to quote 'y'
        onChange(jsYaml.dump(newConfig, { noCompatMode: true }), false);
    };

    const updateValue = (value: string) => {
        try {
            const data = fileDataToConfig(value);
            setConfig((config) => {
                return {
                    ...config,
                    ...data
                };
            });
            onChange(value, false);
        } catch (_error) {
            onChange(value, true);
        }
    };

    return (
        <div className="configuration-panel">
            {currentTab === ConfigurationTab.GENERAL && (
                <Container>
                    <h4>Board information</h4>
                    <TextField
                        label="Name"
                        placeholder="A descriptive name of the configuration"
                        value={config.name}
                        setValue={(value) => appendConfig({ name: value })}
                        maxLength={80}
                    />
                    <SelectField
                        label="Board"
                        value={config.board ?? "None"}
                        options={[
                            { name: "None", value: "None" },
                            { name: "6 Pack", value: "6 Pack" }
                        ]}
                        setValue={(value) => appendConfig({ board: value })}
                    />
                    <TextAreaField
                        label="Meta"
                        value={(config.meta ?? "").replaceAll("<br/>", "\n")}
                        setValue={(value) =>
                            appendConfig({
                                meta: ("" + value).replaceAll("\n", "<br/>")
                            })
                        }
                        maxLength={1000}
                    />
                </Container>
            )}
            {currentTab === ConfigurationTab.AXES && (
                <Container>
                    <AxesGroup
                        board={Boards[0]}
                        config={config}
                        setValue={(value) => appendConfig(value)}
                        usedPins={usedPins}
                    />
                </Container>
            )}

            {currentTab === ConfigurationTab.IO && (
                <Container>
                    <I2SOGroup
                        board={Boards[0]}
                        i2so={config.i2so}
                        setValue={(i2so) => appendConfig({ i2so })}
                        usedPins={usedPins}
                    />

                    <I2CGroup
                        board={Boards[0]}
                        i2c={config.i2c0}
                        setValue={(i2c) => appendConfig({ i2c0: i2c })}
                        usedPins={usedPins}
                    />

                    <SPIGroup
                        board={Boards[0]}
                        spi={config.spi}
                        setValue={(spi) => appendConfig({ spi })}
                        usedPins={usedPins}
                    />

                    <UARTGroup
                        board={Boards[0]}
                        uartName={"UART1"}
                        uart={config.uart1}
                        setValue={(uart) => appendConfig({ uart1: uart })}
                        usedPins={usedPins}
                    />

                    <UARTGroup
                        board={Boards[0]}
                        uartName={"UART2"}
                        uart={config.uart2}
                        setValue={(uart) => appendConfig({ uart2: uart })}
                        usedPins={usedPins}
                    />

                    <ProbeGroup
                        board={Boards[0]}
                        probe={config.probe}
                        setValue={(probe) => appendConfig({ probe })}
                        usedPins={usedPins}
                    />

                    <SDCardGroup
                        board={Boards[0]}
                        sdcard={config.sdcard}
                        setValue={(sdcard) => appendConfig({ sdcard })}
                        usedPins={usedPins}
                    />

                    <OLEDGroup
                        board={Boards[0]}
                        oled={config.oled}
                        setValue={(oled) => appendConfig({ oled })}
                    />

                    <ControlGroup
                        board={Boards[0]}
                        control={config.control}
                        setValue={(control) => appendConfig({ control })}
                        usedPins={usedPins}
                    />
                </Container>
            )}

            {currentTab === ConfigurationTab.SPINDLE && (
                <Container>
                    <SpindleDriverGroup
                        board={Boards[0]}
                        config={config}
                        setValue={(config) => appendConfig(config)}
                        usedPins={usedPins}
                    />
                </Container>
            )}

            {currentTab === ConfigurationTab.SOURCE && (
                <>
                    <Editor
                        value={value}
                        onChange={updateValue}
                        format="yaml"
                    />
                </>
            )}
        </div>
    );
};

export default Configuration;
