import React, { useEffect, useState } from "react";
import { Config } from "../../model/Config";
import { Container, Nav, Tab } from "react-bootstrap";
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
    onClose,
    value,
    onChange
}: ConfigurationProps) => {
    const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);

    useEffect(() => {
        updateValue(value);
    }, [value]);

    const appendConfig = (conf) => {
        const newConfig = { ...config, ...conf };
        setConfig(newConfig);
        onChange(jsYaml.dump(newConfig), false);
    };

    const updateValue = (value) => {
        try {
            const data = jsYaml.load(value);
            setConfig((config) => {
                return {
                    ...config,
                    ...data
                };
            });
            onChange(value, false);
        } catch (error) {
            onChange(value, true);
        }
    }

    return (
        <>
            {currentTab === ConfigurationTab.GENERAL && (
                <Container style={{paddingTop: "32px"}}>
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
                            { name: "6 Pack", value: "6 Pack" }]}
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
                <Container style={{paddingTop: "32px"}}>
                    <AxesGroup
                        board={Boards[0]}
                        axes={config.axes}
                        setValue={(value) => appendConfig({ axes: value })}
                    />
                </Container>
            )}

            {currentTab === ConfigurationTab.IO && (
                <Container style={{paddingTop: "32px"}}>
                    <SteppingGroup
                        steppingConfig={config.stepping}
                        setValue={(stepping) => appendConfig({ stepping })}
                    />

                    <I2SOGroup
                        board={Boards[0]}
                        i2so={config.i2so}
                        setValue={(i2so) => appendConfig({ i2so })}
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
                </Container>
            )}

            {currentTab === ConfigurationTab.SOURCE && (
                <>
                    <Editor
                        value={value}
                        onChange={updateValue}
                    />
                </>
            )}
        </>
    );
};

export default Configuration;
