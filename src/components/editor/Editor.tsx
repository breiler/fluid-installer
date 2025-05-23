import React, { useMemo } from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import jsYaml from "js-yaml";
import { linter, lintGutter } from "@codemirror/lint";
import { basicSetup } from "codemirror";
import { StreamLanguage } from "@codemirror/language";
import { yaml } from "@codemirror/legacy-modes/mode/yaml";

enum Severity {
    ERROR = "error",
    INFO = "info",
    WARNING = "warning"
}

type Diagnostics = {
    from: number;
    to: number;
    message: string;
    severity: Severity;
};

const yamlLinter = linter((view) => {
    const diagnostics: Diagnostics[] = [];

    try {
        jsYaml.load(view.state.doc);
    } catch (e) {
        const loc = e.mark;
        const from = loc ? loc.position : 0;
        const to = from;
        const severity = Severity.ERROR;

        diagnostics.push({
            from,
            to,
            message: e.message,
            severity
        });
    }

    return diagnostics;
});

type Props = {
    value: string;
    onChange: (value: string) => void;
    format: "yaml" | "other";
};

const Editor = ({ value, onChange, format }: Props) => {
    const extensions = useMemo(() => {
        if (format === "yaml") {
            return [
                lintGutter(),
                yamlLinter,
                basicSetup,
                StreamLanguage.define(yaml)
            ];
        }

        return [lintGutter(), basicSetup];
    }, [format]);

    return (
        <>
            <ReactCodeMirror
                minHeight="300px"
                value={value}
                onChange={onChange}
                extensions={extensions}
            />
        </>
    );
};

export default Editor;
