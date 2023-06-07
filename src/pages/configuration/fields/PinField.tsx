import React, { useEffect, useState } from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { Pin, PinActive, PinConfig, PinPull } from "../../../model/Config";
import { Board } from "../../../model/Boards";

type SelectFieldProps = {
    label?: string;
    board: Board;
    value?: PinConfig;
    setValue: (value: PinConfig) => void;
    placeholder?: string;
};

const PinField = ({
    label,
    board,
    value,
    setValue,
    placeholder
}: SelectFieldProps) => {
    const [pin, setPin] = useState<string>(value?.pin + "" ?? Pin.NO_PIN);
    const [pull, setPull] = useState<PinPull>(PinPull.NONE);
    const [active, setActive] = useState<PinActive>(PinActive.HIGH);

    useEffect(() => {
        setValue(new PinConfig(pin, pull, active));
    }, [pin, pull, active]);

    const boardPinConfig = board.pins.find((boardPin) => boardPin.pin === pin);

    return (
        <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
                {label}
            </Form.Label>
            <Col sm="9">
                <InputGroup>
                    <Form.Select
                        aria-label={placeholder}
                        onChange={(event) => setPin(event.target.value)}
                        value={pin + ""}>
                        {board.pins.map((option) => (
                            <option
                                key={option.pin}
                                id={option.pin}
                                value={option.pin}>
                                {option.pin}
                            </option>
                        ))}
                    </Form.Select>
                    {boardPinConfig?.pull && (
                        <Form.Select aria-label="Pulling resistor">
                            <option>No pull</option>
                            <option>Pull up</option>
                            <option>Pull down</option>
                        </Form.Select>
                    )}
                    {pin !== Pin.NO_PIN && (
                        <InputGroup.Text id="basic-addon1">
                            <Form.Check type="checkbox" label="Invert" />
                        </InputGroup.Text>
                    )}
                </InputGroup>
            </Col>
        </Form.Group>
    );
};

export default PinField;
