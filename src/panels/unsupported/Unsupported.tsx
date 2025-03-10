import React from "react";
import PageTitle from "../../components/pagetitle/PageTitle";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartCrack } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const Unsupported = () => {
    const { t } = useTranslation();

    return (
        <>
            <div className="d-flex justify-content-center text-danger">
                <FontAwesomeIcon
                    icon={faHeartCrack as IconDefinition}
                    size="8x"
                />
            </div>
            <div className="d-flex justify-content-center">
                <PageTitle>{t("panel.unsupported.title")}</PageTitle>
            </div>
            <div className="d-flex justify-content-center">
                {t("panel.unsupported.description")}
            </div>
        </>
    );
};

export default Unsupported;
