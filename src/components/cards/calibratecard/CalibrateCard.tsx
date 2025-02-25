import React from "react";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();

    return (
        <Card
            className="select-card"
            footer={
                <Button onClick={onClick} disabled={disabled}>
                    {t("card.calibrate.calibrate")}
                </Button>
            }
        >
            <div className="select-icon">
                <FontAwesomeIcon icon={faSliders as IconDefinition} size="4x" />
            </div>
            <>{t("card.calibrate.calibrate-description")}</>
        </Card>
    );
};
