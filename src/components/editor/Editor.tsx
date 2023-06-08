import React, { useEffect, useState } from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { Config } from "../../model/Config";
import jsYaml from "js-yaml";
import { StreamLanguage } from "@codemirror/language";
import { linter, lintGutter } from "@codemirror/lint";
import { yaml } from "@codemirror/legacy-modes/mode/yaml";
import { EditorView, basicSetup } from "codemirror";
import * as yamlMode from "@codemirror/legacy-modes/mode/yaml";

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

const Editor = ({ value, onLint, onChange }) => {
    useEffect(() => {
        try {
            const data = jsYaml.load(value);
            onLint([]);
        } catch (error) {
            if(error?.name === "YAMLException") {
                onLint([error.message]);
            }
        }
    }, [value]);

    return (
        <>
            <ReactCodeMirror
                value={value}
                onChange={onChange}
                maxHeight="800px"
                extensions={[lintGutter(), yamlLinter, basicSetup]}
            />
        </>
    );
};

export default Editor;
