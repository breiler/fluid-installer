import React, { useEffect, useState } from "react";
import { Config } from "../../model/Config";
import { Container } from "react-bootstrap";
import TextField from "./fields/TextField";
import SelectField from "./fields/SelectField";
import jsYaml from "js-yaml";
import AxesGroup from "./groups/AxesGroup";
import { Boards } from "../../model/Boards";
import SPIGroup from "./groups/SPIGroup";
import SteppingGroup from "./groups/SteppingGroup";
import I2SOGroup from "./groups/I2SOGroup";
import SDCardGroup from "./groups/SDCardGroup";
import Editor from "../../components/editor/Editor";
import SpindleDriverGroup from "./groups/SpindleDriverGroup";
import I2CGroup from "./groups/I2CGroup";
import OLEDGroup from "./groups/OLEDGroup";
import { deepMerge } from "../../utils/utils";
import ControlGroup from "./groups/ControlGroup";

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

    useEffect(() => {
        updateValue(value);
    }, [value]);

    const appendConfig = (conf) => {
        const newConfig = deepMerge(config, conf);
        setConfig(newConfig);

        // No compat mode will not try to quote 'y'
        onChange(jsYaml.dump(newConfig, { noCompatMode: true }), false);
    };

    const updateValue = (value: string) => {
        // Workaround for values beginning with # (should not be treated as comments)
        const regexp = /^(\s*.*:[ \t]*)(#\S.*)$/gm;
        const transformedValue = value.replace(regexp, '$1"$2"');

        try {
            const data = jsYaml.load(transformedValue);
            setConfig((config) => {
                return {
                    ...config,
                    ...data
                };
            });
            onChange(transformedValue, false);
        } catch (error) {
            onChange(transformedValue, true);
        }
    };

    return (
        <>
            {currentTab === ConfigurationTab.GENERAL && (
                <Container style={{ paddingTop: "32px" }}>
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
                    <TextField
                        label="Meta"
                        value={config.meta}
                        setValue={(value) => appendConfig({ meta: value })}
                        maxLength={80}
                    />
                </Container>
            )}
            {currentTab === ConfigurationTab.AXES && (
                <Container style={{ paddingTop: "32px" }}>
                    <AxesGroup
                        board={Boards[0]}
                        config={config}
                        setValue={(value) => appendConfig(value)}
                    />
                </Container>
            )}

            {currentTab === ConfigurationTab.IO && (
                <Container style={{ paddingTop: "32px" }}>
                    <SteppingGroup
                        steppingConfig={config.stepping}
                        setValue={(stepping) => appendConfig({ stepping })}
                    />

                    <I2SOGroup
                        board={Boards[0]}
                        i2so={config.i2so}
                        setValue={(i2so) => appendConfig({ i2so })}
                    />

                    <I2CGroup
                        board={Boards[0]}
                        i2c={config.i2c0}
                        setValue={(i2c) => appendConfig({ i2c0: i2c })}
                    />

                    <SPIGroup
                        board={Boards[0]}
                        spi={config.spi}
                        setValue={(spi) => appendConfig({ spi })}
                    />

                    <SDCardGroup
                        board={Boards[0]}
                        sdcard={config.sdcard}
                        setValue={(sdcard) => appendConfig({ sdcard })}
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
                    />
                </Container>
            )}

            {currentTab === ConfigurationTab.SPINDLE && (
                <Container style={{ paddingTop: "32px" }}>
                    <SpindleDriverGroup
                        board={Boards[0]}
                        config={config}
                        setValue={(config) => appendConfig(config)}
                    />
                </Container>
            )}

            {currentTab === ConfigurationTab.SOURCE && (
                <>
                    <Editor value={value} onChange={updateValue} />
                </>
            )}
        </>
    );
};

export default Configuration;
