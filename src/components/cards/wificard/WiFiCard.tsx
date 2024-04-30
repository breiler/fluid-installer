import React from "react";
import Card from "../card";
import Button from "../../button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWifi } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type WiFiCardProps = {
    disabled?: boolean;
    onClick: () => void;
};

export const WiFiCard = ({ onClick, disabled = false }: WiFiCardProps) => {
    return (
        <Card
            className="select-card"
            footer={
                <Button onClick={onClick} disabled={disabled}>
                    <>Configure WiFi</>
                </Button>
            }
        >
            <div className="select-icon">
                <FontAwesomeIcon icon={faWifi as IconDefinition} size="4x" />
            </div>
            <>Manage the controller WiFi settings</>
        </Card>
    );
};
