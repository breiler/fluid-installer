import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Card } from "react-bootstrap";
import { ControllerServiceContext } from "../../../context/ControllerServiceContext";

type InstallCardProps = {
    disabled?: boolean;
    onClick: () => void;
};

export const InstallCard = ({
    onClick,
    disabled = false
}: InstallCardProps) => {
    const controllerService = useContext(ControllerServiceContext);
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
                {controllerService.version && (
                    <>
                        <p>{t("card.install.upgrade-description")}</p>
                        <p>{controllerService.build}</p>
                    </>
                )}
                {!controllerService.version && (
                    <p>{t("card.install.install-description")}</p>
                )}
            </Card.Body>

            <Card.Footer>
                <Button onClick={onClick} disabled={disabled}>
                    <>
                        {controllerService.version
                            ? t("card.install.upgrade-button")
                            : t("card.install.install-button")}
                    </>
                </Button>
            </Card.Footer>
        </Card>
    );
};
