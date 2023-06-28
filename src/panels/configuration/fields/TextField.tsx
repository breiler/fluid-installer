import React from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";

type TextFieldProps = {
    label?: string;
    value?: string | number;
    setValue?: (value: string | number) => void;
    placeholder?: string;
    unit?: string;
    maxLength?: number;
    helpText?: string;
};

const TextField = ({
    label,
    value,
    setValue = (value) => { },
    placeholder = "",
    unit,
    maxLength = 80,
    helpText
}: TextFieldProps) => {
    return (
        <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
                {label}
            </Form.Label>
            <Col sm="9">
                <InputGroup>
                    <Form.Control
                        type="text"
                        placeholder={placeholder}
                        maxLength={maxLength}
                        value={value === undefined ? "" : value}
                        onChange={(event) => setValue(event.target.value)}
                    />
                    {unit && <InputGroup.Text>{unit}</InputGroup.Text>}
                </InputGroup>
                {helpText && <Form.Text muted>{helpText}</Form.Text>}
            </Col>
        </Form.Group>
    );
};

export default TextField;
