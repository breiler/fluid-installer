import React from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { Config } from "../../model/Config";
import jsYaml from "js-yaml";
import { linter, lintGutter } from "@codemirror/lint";
import { basicSetup } from "codemirror";
import { StreamLanguage } from "@codemirror/language"
import { yaml } from "@codemirror/legacy-modes/mode/yaml"

const DEFAULT_CONFIG: Config = {};

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

const Editor = ({ value,  onChange }) => {
    return (
        <>
            <ReactCodeMirror
                value={value}
                onChange={onChange}
                extensions={[lintGutter(), yamlLinter, basicSetup]} //StreamLanguage.define(yaml)]}
            />
        </>
    );
};

export default Editor;
