import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ControllerServiceContext } from "../../../context/ControllerServiceContext";
import { Card } from "react-bootstrap";
import { VersionCommand } from "../../../services/controllerservice/commands/VersionCommand";
import Spinner from "../../spinner";

type InstallCardProps = {
    disabled?: boolean;
    onClick: () => void;
};

export const InstallCard = ({
    onClick,
    disabled = false
}: InstallCardProps) => {
    const controllerService = useContext(ControllerServiceContext);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [version, setVersion] = useState<string>();
    const { t } = useTranslation();

    useEffect(() => {
        setIsLoading(false);
        if (!controllerService) return;
        setIsLoading(true);

        controllerService
            .send(new VersionCommand(), 5000)
            .then((command) => setVersion(command.result()))
            .finally(() => setIsLoading(false));
    }, [controllerService, setIsLoading]);

    return (
        <Card className="select-card">
            <Card.Body>
                <div className="select-icon">
                    <FontAwesomeIcon
                        icon={faDownload as IconDefinition}
                        size="4x"
                    />
                </div>
                {isLoading && <Spinner />}
                {!isLoading && version && (
                    <p>{t("card.install.upgrade-description")}</p>
                )}
                {!isLoading && !version && (
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
