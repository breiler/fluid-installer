import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

type Props = {
    children: ReactNode;
};

const ToolTip = ({ children }: Props) => {
    return (
        <span style={{ marginLeft: "2px" }}>
            {children && (
                <OverlayTrigger overlay={<Tooltip>{children}</Tooltip>}>
                    <FontAwesomeIcon
                        icon={faInfoCircle as IconDefinition}
                        size="sm"
                        color="#3e6cf8"
                    />
                </OverlayTrigger>
            )}
        </span>
    );
};

export default ToolTip;
