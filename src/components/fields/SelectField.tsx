import React, { ReactElement } from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";

type Option = {
    name: string;
    value: string;
};

type SelectFieldProps = {
    label?: string;
    value?: string;
    setValue?: (value: string) => void;
    options: Option[];
    placeholder?: string;
    helpText?: string;
    groupedControls?: ReactElement;
    disabled?: boolean;
};

const SelectField = ({
    label,
    value,
    setValue = () => {},
    options = [],
    placeholder = "",
    helpText,
    groupedControls,
    disabled
}: SelectFieldProps) => {
    return (
        <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
                {label}
            </Form.Label>
            <Col sm="9">
                <InputGroup>
                    <Form.Select
                        disabled={disabled}
                        aria-label={placeholder}
                        onChange={(event) => setValue(event.target.value)}
                        value={value}
                    >
                        {value &&
                            !options.find(
                                (option) => option.value === value
                            ) && (
                                <option key={value} id={value} value={value}>
                                    {value}
                                </option>
                            )}
                        {options.map((option) => (
                            <option
                                key={option.value}
                                id={option.value}
                                value={option.value}
                            >
                                {option.name}
                            </option>
                        ))}
                    </Form.Select>
                    {groupedControls && groupedControls}
                </InputGroup>

                {helpText && <Form.Text muted>{helpText}</Form.Text>}
            </Col>
        </Form.Group>
    );
};

export default SelectField;
