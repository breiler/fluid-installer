import React from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";

type TextFieldProps = {
    label?: string;
    value?: string | number;
    setValue?: (value: string | number) => void;
    placeholder?: string;
    unit?: string;
    maxLength?: number;
};

const TextField = ({
    label,
    value,
    setValue = (value) => {},
    placeholder = "",
    unit,
    maxLength = 80
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
                        value={value ?? ""}
                        onChange={(event) => setValue(event.target.value)}
                    />
                    {unit && <InputGroup.Text>{unit}</InputGroup.Text>}
                </InputGroup>
            </Col>
        </Form.Group>
    );
};

export default TextField;
