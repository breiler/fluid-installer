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
    helpText?: string;
};

const PinField = ({
    label,
    board,
    value,
    setValue,
    placeholder,
    helpText
}: SelectFieldProps) => {
    const [pin, setPin] = useState<string | undefined>(value?.pin);
    const [pull, setPull] = useState<string | undefined>(value?.pull);
    const [active, setActive] = useState<string | undefined>(value?.active);

    useEffect(() => {
        setValue(
            new PinConfig(
                pin ?? Pin.NO_PIN,
                pull ?? PinPull.NONE,
                active ?? PinActive.HIGH
            )
        );
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
                        value={pin ?? Pin.NO_PIN}
                    >
                        {board.pins.map((option) => (
                            <option
                                key={option.pin}
                                id={option.pin}
                                value={option.pin}
                                disabled={option.restricted}
                            >
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
                            onChange={(event) => setPull(event.target.value)}
                        >
                            <option key={"none"} id={"none"} value="">
                                No pull
                            </option>
                            <option
                                key={PinPull.UP}
                                id={PinPull.UP}
                                value={PinPull.UP}
                            >
                                Pull up
                            </option>
                            <option
                                key={PinPull.DOWN}
                                id={PinPull.DOWN}
                                value={PinPull.DOWN}
                            >
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
                {helpText && <Form.Text muted>{helpText}</Form.Text>}
            </Col>
        </Form.Group>
    );
};

export default PinField;
