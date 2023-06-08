import React, { useEffect } from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { Config } from "../../model/Config";
import jsYaml from "js-yaml";
import { linter, lintGutter } from "@codemirror/lint";
import { basicSetup } from "codemirror";

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

const Editor = ({ value, onLint, onChange, maxHeight }) => {
    useEffect(() => {
        try {
            jsYaml.load(value);
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
                maxHeight={maxHeight}
                extensions={[lintGutter(), yamlLinter, basicSetup]}
            />
        </>
    );
};

export default Editor;
