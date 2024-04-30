import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../button";
import Card from "../card";
import { faTerminal } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type TerminalCardProps = {
    disabled: boolean;
    onClick: () => void;
};

export const TerminalCard = ({
    disabled = false,
    onClick
}: TerminalCardProps) => {
    return (
        <Card
            className="select-card"
            footer={
                <Button onClick={onClick} disabled={disabled}>
                    <>Open terminal</>
                </Button>
            }
        >
            <div className="select-icon">
                <FontAwesomeIcon
                    icon={faTerminal as IconDefinition}
                    size="4x"
                />
            </div>
            <>Open a serial terminal to your controller</>
        </Card>
    );
};
