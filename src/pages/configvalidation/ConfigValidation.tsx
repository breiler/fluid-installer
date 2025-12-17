import React, { useEffect, useState } from "react";
import Editor from "../../components/editor/Editor";
import { Alert } from "react-bootstrap";
import jsYaml from "js-yaml";
import type { YAMLException } from "js-yaml";

import Ajv, { ErrorObject } from "ajv/dist/2020";

const ajv = new Ajv();

export const ConfigValidation = () => {
    const [config, setConfig] = useState("");
    const [schema, setSchema] = useState();
    const [errors, setErrors] = useState<ErrorObject[]>([]);

    useEffect(() => {
        fetch("schema/fluidnc.schema.json").then(async (response) => {
            setSchema(await response.json());
        });
    }, []);

    useEffect(() => {
        if (!schema) {
            return;
        }

        let jsonConfig = {};
        try {
            // Workaround for values beginning with # (should not be treated as comments)
            const regexp = /^(\s*.*:[ \t]*)(#\S.*)$/gm;
            const transformedValue = config.replace(regexp, '$1"$2"');
            jsonConfig = jsYaml.load(transformedValue || "");
        } catch (error) {
            setErrors([
                {
                    instancePath: "",
                    message: `YAML syntax error: ${(error as YAMLException).message}`,
                    keyword: "syntax",
                    schemaPath: "",
                    params: {}
                } as ErrorObject
            ]);
            return;
        }

        const validate = ajv.compile(schema);
        validate(jsonConfig);
        setErrors(validate.errors || []);
    }, [schema, config]);

    // Format Ajv errors for display
    const formattedErrors = errors.map((err, index) => {
        const path = err.instancePath
            ? err.instancePath.replace(/^\//, "")
            : "(root)";

        // Build extra context for better UX
        let extra = "";
        if (err.keyword === "enum" && Array.isArray(err.params.allowedValues)) {
            extra = `Allowed values: ${err.params.allowedValues.join(", ")}`;
        } else if (err.keyword === "type" && err.params.type) {
            extra = `Expected type: ${err.params.type}`;
        } else if (err.keyword === "required" && err.params.missingProperty) {
            extra = `Missing property: ${err.params.missingProperty}`;
        } else if (
            err.keyword === "additionalProperties" &&
            err.params.additionalProperty
        ) {
            extra = `Unexpected property: ${err.params.additionalProperty}`;
        } else if (
            err.keyword === "minimum" &&
            err.params.limit !== undefined
        ) {
            extra = `Value must be ≥ ${err.params.limit}`;
        } else if (
            err.keyword === "maximum" &&
            err.params.limit !== undefined
        ) {
            extra = `Value must be ≤ ${err.params.limit}`;
        } else if (err.keyword === "pattern" && err.params.pattern) {
            extra = `Expected to match pattern: ${err.params.pattern}`;
        }

        return (
            <Alert key={index} variant="danger" className="mb-2 py-1 px-2">
                <strong>{path}:</strong> {err.message}
                {extra && (
                    <>
                        <br />
                        <small className="text-muted">{extra}</small>
                    </>
                )}
            </Alert>
        );
    });

    return (
        <>
            <div
                style={{
                    height: "500px",
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    borderRadius: "0.5rem"
                }}
            >
                <Editor value={config} onChange={setConfig} format={"yaml"} />
            </div>
            <div className="mt-3">
                {errors.length === 0 ? (
                    <Alert variant="success" className="py-1 px-2 mb-0">
                        ✅ Configuration is valid
                    </Alert>
                ) : (
                    <div>{formattedErrors}</div>
                )}
            </div>
        </>
    );
};
