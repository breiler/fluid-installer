import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faInfoCircle, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { CSSProperties } from "react";
import { ReactNode } from "react";
import { Alert, Stack } from "react-bootstrap";

type AlertMessageProps = {
    children: ReactNode;
    variant?: "danger" | "warning" | "info";
    style?: CSSProperties;
};
const AlertMessage = ({ children, variant, style }: AlertMessageProps) => {
    return (
        <Alert variant={variant} style={style}>
            <Stack direction="horizontal" gap={3}>
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

                <>{children}</>
            </Stack>
        </Alert>
    );
};

export default AlertMessage;
