import React from "react";
import { useTranslation } from "react-i18next";
import Button from "../../button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Card } from "react-bootstrap";
import useControllerState from "../../../store/ControllerState";

type InstallCardProps = {
    disabled?: boolean;
    onClick: () => void;
};

export const InstallCard = ({
    onClick,
    disabled = false
}: InstallCardProps) => {
    const version = useControllerState((state) => state.version);
    const { t } = useTranslation();

    return (
        <Card className="select-card">
            <Card.Body>
                <div className="select-icon">
                    <FontAwesomeIcon
                        icon={faDownload as IconDefinition}
                        size="4x"
                    />
                </div>
                {version !== "?" && (
                    <>
                        <p>{t("card.install.upgrade-description")}</p>
                    </>
                )}
                {version === "?" && (
                    <p>{t("card.install.install-description")}</p>
                )}
            </Card.Body>

            <Card.Footer>
                <Button onClick={onClick} disabled={disabled}>
                    <>
                        {version
                            ? t("card.install.upgrade-button")
                            : t("card.install.install-button")}
                    </>
                </Button>
            </Card.Footer>
        </Card>
    );
};
