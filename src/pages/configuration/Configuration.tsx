import React, { useEffect, useState } from "react";
import { Config } from "../../model/Config";
import {
    Accordion,
    Col,
    Container,
    Form,
    InputGroup,
    Nav,
    Row
} from "react-bootstrap";
import TextField from "./fields/TextField";
import SelectField from "./fields/SelectField";
import yamlConfig from "../../configs/6P_extn";
import jsYaml from "js-yaml";
import ReactCodeMirror from "@uiw/react-codemirror";

import { StreamLanguage } from "@codemirror/language";
import { linter, lintGutter } from "@codemirror/lint";
import { yaml } from "@codemirror/legacy-modes/mode/yaml";
import { EditorView, basicSetup } from "codemirror";
import * as yamlMode from "@codemirror/legacy-modes/mode/yaml";
import AxesGroup from "./groups/AxesGroup";
import UnknownField from "./fields/UnknownField";
import { Boards } from "../../model/Boards";
import SPIGroup from "./groups/SPIGroup";
import SteppingGroup from "./groups/SteppingGroup";
import I2SOGroup from "./groups/I2SOGroup";
import SDCardGroup from "./groups/SDCardGroup";

const DEFAULT_CONFIG: Config = {};

const yamlExtension = StreamLanguage.define(yamlMode.yaml);

const yamlLinter = linter((view) => {
    const diagnostics: any[] = [];

    try {
        jsYaml.load(view.state.doc);
    } catch (e) {
        const loc = e.mark;
        const from = loc ? loc.position : 0;
        const to = from;
        const severity = "error";

        diagnostics.push({
            from,
            to,
            message: e.message,
            severity
        });
    }

    return diagnostics;
});

const Configuration = ({onClose}) => {
    const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
    const [configString, setConfigString] = useState<string>(yamlConfig);
    const [tab, setTab] = useState<string>("general");

    const appendConfig = (conf) => {
        const newConfig = { ...config, ...conf };
        setConfig(newConfig);
        setConfigString(jsYaml.dump(newConfig));
    };

    useEffect(() => {
        try {
            const data = jsYaml.load(configString);
            const newData = { ...data, ...config };
            setConfigString(jsYaml.dump(newData));
        } catch (error) {
            console.log("Could not parse yaml");
        }
    }, []);

    useEffect(() => {
        try {
            const data = jsYaml.load(configString);
            setConfig((config) => {
                return {
                    ...config,
                    ...data
                };
            });
        } catch (error) {
            console.log(error);
        }
    }, [configString]);

    return (
        <Container>
            <br/>
            <Nav
                fill
                variant="tabs"
                defaultActiveKey="general"
                onSelect={(tabId) => setTab(tabId as string)}>
                <Nav.Item>
                    <Nav.Link eventKey="general">General</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="axes">Axes</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="io">IO</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="spindle">Spindle</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="source">Source</Nav.Link>
                </Nav.Item>
            </Nav>

            {tab === "general" && (
                <>
                    <h4>Board information</h4>
                    <TextField
                        label="Name"
                        placeholder="A descriptive name of the configuration"
                        value={config.name}
                        setValue={(value) => appendConfig({ name: value })}
                    />
                    <SelectField
                        label="Board"
                        value={config.board}
                        options={[{ name: "6 Pack", value: "6 Pack" }]}
                        setValue={(value) => appendConfig({ board: value })}
                    />
                    <TextField
                        label="Meta"
                        placeholder="Meta information"
                        value={config.meta}
                        setValue={(value) => appendConfig({ meta: value })}
                    />

                    <SteppingGroup steppingConfig={config.stepping} />
                </>
            )}

            {tab === "axes" && (
                <AxesGroup
                    board={Boards[0]}
                    axes={config.axes}
                    setValue={(value) => appendConfig({ axes: value })}
                />
            )}

            {tab === "io" && (
                <>
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
                </>
            )}

            {tab === "source" && (
                <ReactCodeMirror
                    value={configString}
                    readOnly={true}
                    maxHeight="800px"
                    extensions={[lintGutter(), yamlLinter]}
                />
            )}
        </Container>
    );
};

export default Configuration;
