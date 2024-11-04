import React from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import ToolTip from "../tooltip/ToolTip";

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
            <Form.Label column sm="4">
                {label} <ToolTip>{helpText}</ToolTip>
            </Form.Label>
            <Col sm="8">
                <InputGroup>
                    <Form.Check
                        style={{ paddingTop: "8px" }}
                        type="switch"
                        aria-label={placeholder}
                        onChange={(event) =>
                            setValue(Boolean(event.target.checked))
                        }
                        checked={Boolean(value)}
                    />
                </InputGroup>
            </Col>
        </Form.Group>
    );
};

export default BooleanField;
