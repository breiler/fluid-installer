import React from "react";
import { Axes } from "../../../model/Config";
import AxisGroup from "./AxisGroup";
import PinField from "../fields/PinField";
import { Board } from "../../../model/Boards";
import { Nav, Tab } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faBan } from "@fortawesome/free-solid-svg-icons";

type SelectFieldProps = {
    board: Board;
    axes?: Axes;
    setValue?: (value: Axes) => void;
};

const AxesGroup = ({
    board,
    axes,
    setValue = (value: Axes) => {}
}: SelectFieldProps) => {
    return (
        <>
            <h4>Axes</h4>

            <PinField
                label="Shared disable pin"
                board={board}
                setValue={(value) => {}}
            />
            <PinField
                label="Shared reset pin"
                board={board}
                setValue={(value) => {}}
            />

            <br />
            <br />

            <Tab.Container defaultActiveKey="axisx">
                <Nav fill variant="tabs">
                    <Nav.Item>
                        <Nav.Link eventKey="axisx">
                            X{" "}
                            {!axes?.x && (
                                <FontAwesomeIcon
                                    icon={faBan as IconDefinition}
                                />
                            )}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="axisy">
                            Y{" "}
                            {!axes?.y && (
                                <FontAwesomeIcon
                                    icon={faBan as IconDefinition}
                                />
                            )}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="axisz">
                            Z{" "}
                            {!axes?.z && (
                                <FontAwesomeIcon
                                    icon={faBan as IconDefinition}
                                />
                            )}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="axisa">
                            A{" "}
                            {!axes?.a && (
                                <FontAwesomeIcon
                                    icon={faBan as IconDefinition}
                                />
                            )}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="axisb">
                            B{" "}
                            {!axes?.b && (
                                <FontAwesomeIcon
                                    icon={faBan as IconDefinition}
                                />
                            )}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="axisc">
                            Z{" "}
                            {!axes?.c && (
                                <FontAwesomeIcon
                                    icon={faBan as IconDefinition}
                                />
                            )}
                        </Nav.Link>
                    </Nav.Item>
                </Nav>

                <Tab.Content>
                    <br/>
                    <Tab.Pane eventKey="axisx">
                        <AxisGroup
                            axisLabel="X"
                            axis={axes?.x}
                            setValue={(value) =>
                                setValue({ ...axes, x: value })
                            }
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey="axisy">
                        <AxisGroup
                            axisLabel="Y"
                            axis={axes?.y}
                            setValue={(value) =>
                                setValue({ ...axes, y: value })
                            }
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey="axisz">
                        <AxisGroup
                            axisLabel="Z"
                            axis={axes?.z}
                            setValue={(value) =>
                                setValue({ ...axes, z: value })
                            }
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey="axisa">
                        <AxisGroup
                            axisLabel="A"
                            axis={axes?.a}
                            setValue={(value) =>
                                setValue({ ...axes, a: value })
                            }
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey="axisb">
                        <AxisGroup
                            axisLabel="B"
                            axis={axes?.b}
                            setValue={(value) =>
                                setValue({ ...axes, b: value })
                            }
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey="axisc">
                        <AxisGroup
                            axisLabel="C"
                            axis={axes?.c}
                            setValue={(value) =>
                                setValue({ ...axes, c: value })
                            }
                        />
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </>
    );
};

export default AxesGroup;
