import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faInfoCircle, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { CSSProperties } from "react";
import { ReactNode } from "react";
import { Alert, Col, Row } from "react-bootstrap";

type AlertMessageProps = {
    children: ReactNode;
    variant?: "danger" | "warning" | "info";
    style?: CSSProperties;
};
const AlertMessage = ({ children, variant, style }: AlertMessageProps) => {
    return (
        <Alert variant={variant} style={style}>
            <Row>
                <Col
                    sm="1"
                    style={{
                        marginTop: "auto",
                        marginBottom: "auto"
                    }}
                >
                    {variant === "warning" ||
                        (variant === "danger" && (
                            <FontAwesomeIcon
                                icon={faWarning as IconDefinition}
                                size="2x"
                            />
                        ))}
                    {variant === "info" && (
                        <FontAwesomeIcon
                            icon={faInfoCircle as IconDefinition}
                            size="2x"
                        />
                    )}
                </Col>
                <Col style={{ textAlign: "left", marginLeft: "20px" }}>
                    {children}
                </Col>
            </Row>
        </Alert>
    );
};

export default AlertMessage;
