import React from "react";
import { Col, Form, Row } from "react-bootstrap";

type BooleanFieldProps = {
    label?: string;
    value?: boolean;
    setValue: (value: boolean) => void;
    placeholder?: string;
};

const BooleanField = ({
    label,
    value,
    setValue,
    placeholder = ""
}: BooleanFieldProps) => {
    return (
        <>
            <Form>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">
                        {label}
                    </Form.Label>
                    <Col sm="9">
                        <Form.Check
                            aria-label={placeholder}
                            onChange={(event) =>
                                setValue(event.target.value + "" === "true")
                            }
                            checked={value}
                        />
                    </Col>
                </Form.Group>
            </Form>
        </>
    );
};

export default BooleanField;
