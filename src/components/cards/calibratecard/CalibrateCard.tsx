import React from "react";
import Card from "../card";
import Button from "../../button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type CalibrateCardProps = {
    disabled?: boolean;
    onClick: () => void;
};

export const CalibrateCard = ({
    onClick,
    disabled = false
}: CalibrateCardProps) => {
    return (
        <Card
            className="select-card"
            footer={
                <Button onClick={onClick} disabled={disabled}>
                    <>Calibrate</>
                </Button>
            }
        >
            <div className="select-icon">
                <FontAwesomeIcon icon={faSliders as IconDefinition} size="4x" />
            </div>
            <>Calibrate settings on your controller</>
        </Card>
    );
};
