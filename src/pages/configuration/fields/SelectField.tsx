import React from "react";
import { Col, Form, Row } from "react-bootstrap";

type Option = {
    name: string;
    value: string;
};

type SelectFieldProps = {
    label?: string;
    value?: string;
    setValue: (value: string) => void;
    options: Option[];
    placeholder?: string;
};

const SelectField = ({
    label,
    value,
    setValue = (value: string) => {},
    options = [],
    placeholder = ""
}: SelectFieldProps) => {
    return (
        <>
            <Form>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">
                        {label}
                    </Form.Label>
                    <Col sm="9">
                        <Form.Select
                            aria-label={placeholder}
                            onChange={(event) => setValue(event.target.value)}
                            value={value}>
                            {value &&
                                !options.find(
                                    (option) => option.value === value
                                ) && (
                                    <option
                                        key={value}
                                        id={value}
                                        value={value}>
                                        {value}
                                    </option>
                                )}
                            {options.map((option) => (
                                <option
                                    key={option.value}
                                    id={option.value}
                                    value={option.value}>
                                    {option.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                </Form.Group>
            </Form>
        </>
    );
};

export default SelectField;
