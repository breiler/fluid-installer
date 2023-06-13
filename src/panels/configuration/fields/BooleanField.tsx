import React from "react";
import { Col, Form, Row } from "react-bootstrap";

type BooleanFieldProps = {
    label?: string;
    value?: boolean;
    setValue: (value: boolean) => void;
    placeholder?: string;
    helpText?: string;
};

const BooleanField = ({
    label,
    value,
    setValue,
    placeholder = "",
    helpText
}: BooleanFieldProps) => {
    return (
        <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
                {label}
            </Form.Label>
            <Col sm="9">
                <Form.Check
                    aria-label={placeholder}
                    onChange={(event) =>
                        setValue(Boolean(event.target.checked))
                    }
                    checked={Boolean(value)}
                />
                {helpText && <Form.Text muted>{helpText}</Form.Text>}
            </Col>
        </Form.Group>
    );
};

export default BooleanField;
