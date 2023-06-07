import React, { useState } from "react";
import Card from "../card";
import Button from "../button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs, faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type ConfigurationCardProps = {
    disabled?: boolean;
    onClick: () => void;
};

export const ConfigurationCard = ({
    onClick,
    disabled = false
}: ConfigurationCardProps) => {
    return (
        <Card
            className="select-card"
            footer={
                <Button onClick={onClick} disabled={disabled}>
                    <>Configure</>
                </Button>
            }>
            <div className="select-icon">
                <FontAwesomeIcon
                    icon={faCogs as IconDefinition}
                    size="4x"
                />
            </div>
            <>Manage the configuration on your controller</>
        </Card>
    );
};
