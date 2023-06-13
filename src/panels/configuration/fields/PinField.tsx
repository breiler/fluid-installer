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
    const [pull, setPull] = useState<string>(value?.pull + "" ?? PinPull.NONE);
    const [active, setActive] = useState<string>(
        value?.active + "" ?? PinActive.HIGH
    );

    console.log(value);

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
                                {option.pin}{" "}
                                {!option.pull &&
                                    option.pin !== Pin.NO_PIN &&
                                    "- pull unavailable"}
                            </option>
                        ))}
                    </Form.Select>
                    {boardPinConfig?.pull && (
                        <Form.Select
                            aria-label="Pulling resistor"
                            value={pull + ""}
                            onChange={(event) => setPull(event.target.value)}>
                            <option key={"none"} id={"none"} value="">
                                No pull
                            </option>
                            <option
                                key={PinPull.UP}
                                id={PinPull.UP}
                                value={PinPull.UP}>
                                Pull up
                            </option>
                            <option
                                key={PinPull.DOWN}
                                id={PinPull.DOWN}
                                value={PinPull.DOWN}>
                                Pull down
                            </option>
                        </Form.Select>
                    )}
                    {pin !== Pin.NO_PIN && (
                        <InputGroup.Text>
                            <Form.Check
                                type="checkbox"
                                label="Invert"
                                checked={active == PinActive.LOW}
                                onChange={(event) => {
                                    if (event.target.checked) {
                                        setActive(PinActive.LOW);
                                    } else {
                                        setActive(PinActive.HIGH);
                                    }
                                }}
                            />
                        </InputGroup.Text>
                    )}
                </InputGroup>
            </Col>
        </Form.Group>
    );
};

export default PinField;
