import React from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { ReactElement } from "react-markdown/lib/react-markdown";
import ToolTip from "../tooltip/ToolTip";

type TextFieldProps = {
    label?: string;
    value?: string | number;
    setValue?: (value: string | number) => void;
    placeholder?: string;
    unit?: string;
    maxLength?: number;
    rows?: number;
    helpText?: string;
    groupedControls?: ReactElement;
    type?: string;
    validationMessage?: string;
    disabled?: boolean;
};

const TextField = ({
    label,
    value,
    setValue = () => {},
    placeholder = "",
    unit,
    maxLength = 80,
    rows = 3,
    helpText,
    groupedControls,
    type,
    validationMessage,
    disabled
}: TextFieldProps) => {
    return (
        <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="4">
                {label} <ToolTip>{helpText}</ToolTip>
            </Form.Label>
            <Col>
                <InputGroup hasValidation>
                    <Form.Control
                        disabled={disabled}
                        type={type ?? "text"}
                        as={"textarea"}
                        rows={rows}
                        placeholder={placeholder}
                        maxLength={maxLength}
                        value={value === undefined ? "" : value}
                        onChange={(event) => setValue(event.target.value)}
                        isInvalid={!!validationMessage}
                    />
                    {validationMessage && (
                        <Form.Control.Feedback type="invalid">
                            {validationMessage}
                        </Form.Control.Feedback>
                    )}
                    {unit && <InputGroup.Text>{unit}</InputGroup.Text>}
                    {groupedControls && groupedControls}
                </InputGroup>
            </Col>
        </Form.Group>
    );
};

export default TextField;
