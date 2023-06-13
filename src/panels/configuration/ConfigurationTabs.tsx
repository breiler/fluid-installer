import React, { CSSProperties } from "react";
import { Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ConfigurationTab } from "./Configuration";

type ConfigurationTabsProps = {
    hasErrors?: boolean;
    currentTab?: ConfigurationTab;
    onChange: (value: ConfigurationTab) => void;
    style?: CSSProperties;
};

const ConfigurationTabs = ({
    hasErrors,
    currentTab = ConfigurationTab.GENERAL,
    onChange,
    style
}: ConfigurationTabsProps) => {
    return (
        <Nav fill variant="tabs" style={style}>
            <Nav.Item>
                <Nav.Link
                    eventKey="general"
                    disabled={hasErrors}
                    active={currentTab === ConfigurationTab.GENERAL}
                    onClick={() => onChange(ConfigurationTab.GENERAL)}>
                    General{" "}
                    {hasErrors && (
                        <FontAwesomeIcon color="#ffe69c" icon={faWarning as IconDefinition} />
                    )}
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link
                    eventKey="axes"
                    disabled={hasErrors}
                    active={currentTab === ConfigurationTab.AXES}
                    onClick={() => onChange(ConfigurationTab.AXES)}>
                    Axes{" "}
                    {hasErrors && (
                        <FontAwesomeIcon color="#ffe69c" icon={faWarning as IconDefinition} />
                    )}
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link
                    eventKey="io"
                    disabled={hasErrors}
                    active={currentTab === ConfigurationTab.IO}
                    onClick={() => onChange(ConfigurationTab.IO)}>
                    {" "}
                    IO{" "}
                    {hasErrors && (
                        <FontAwesomeIcon color="#ffe69c" icon={faWarning as IconDefinition} />
                    )}
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link
                    eventKey="spindle"
                    disabled={hasErrors}
                    active={currentTab === ConfigurationTab.SPINDLE}
                    onClick={() => onChange(ConfigurationTab.SPINDLE)}>
                    Spindle{" "}
                    {hasErrors && (
                        <FontAwesomeIcon color="#ffe69c" icon={faWarning as IconDefinition} />
                    )}
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link
                    eventKey="source"
                    active={currentTab === ConfigurationTab.SOURCE}
                    onClick={() => onChange(ConfigurationTab.SOURCE)}>
                    Source
                </Nav.Link>
            </Nav.Item>
        </Nav>
    );
};

export default ConfigurationTabs;
