import React, { useEffect, useState } from "react";
import { Spinner } from "../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Alert } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const BOOLOADER_WARNING_TIMEOUT = 8000;

const BootloaderInfo = () => {
    const [showBootloaderWarning, setShowBootloaderWarning] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        setShowBootloaderWarning(false);
        setTimeout(() => {
            setShowBootloaderWarning(true);
        }, BOOLOADER_WARNING_TIMEOUT);
    }, []);

    return (
        <>
            <h3>{t("panel.progress.title")}</h3>
            {!showBootloaderWarning && (
                <p>
                    {t("panel.bootloader.waiting")} <Spinner />
                </p>
            )}
            {showBootloaderWarning && (
                <Alert variant="warning">
                    <FontAwesomeIcon
                        icon={faWarning as IconDefinition}
                        size="lg"
                    />{" "}
                    {t("panel.bootloader.not-active")}
                </Alert>
            )}
        </>
    );
};

export default BootloaderInfo;
