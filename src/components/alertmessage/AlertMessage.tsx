import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { ReactNode } from "react";
import { Alert, Col, Row } from "react-bootstrap";

type AlertMessageProps = {
    children: ReactNode;
    variant?: "danger" | "warning" | "info";
};
const AlertMessage = ({ children, variant }: AlertMessageProps) => {
    return (
        <Alert variant={variant}>
            <Row>
                <Col
                    xs={1}
                    style={{
                        marginTop: "auto",
                        marginBottom: "auto"
                    }}
                >
                    <FontAwesomeIcon
                        icon={faWarning as IconDefinition}
                        size="2x"
                    />
                </Col>
                <Col style={{ textAlign: "left" }}>{children}</Col>
            </Row>
        </Alert>
    );
};

export default AlertMessage;
