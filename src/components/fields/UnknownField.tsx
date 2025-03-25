import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import yaml from "js-yaml";

type UnknownFieldProps<T> = {
    label: string;
    value?: T;
    setValue?: (value: T) => void;
};

const UnknownField = <T extends unknown>({
    label,
    value,
    setValue
}: UnknownFieldProps<T>) => {
    const [text, setText] = useState<string>();

    useEffect(() => {
        try {
            setText(yaml.dump(value));
        } catch (error) {
            console.debug(error);
        }
    }, [value]);

    const onBlur = () => {
        try {
            const data = yaml.load(text);
            setValue && setValue(data);
        } catch (error) {
            console.debug(error);
        }
    };

    return (
        <Form.Group as={Row} className="mb-3">
            <h4>{label}</h4>
            <Form.Label column sm="4">
                {label}
            </Form.Label>
            <Col sm="8">
                <Form.Control
                    as="textarea"
                    rows={6}
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    onBlur={() => onBlur()}
                />
            </Col>
        </Form.Group>
    );
};

export default UnknownField;
