import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faHeartCrack } from "@fortawesome/free-solid-svg-icons";
import PageTitle from "../../components/pagetitle/PageTitle";
import { useTranslation } from "react-i18next";
import Page from "../../model/Page";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
    const { t } = useTranslation();

    return (
        <div className="container">
            <div className="d-flex justify-content-center text-danger">
                <FontAwesomeIcon
                    icon={faHeartCrack as IconDefinition}
                    size="8x"
                />
            </div>
            <div className="d-flex justify-content-center">
                <PageTitle>{t("page.not-found.title")}</PageTitle>
            </div>
            <div className="d-flex justify-content-center">
                <Link to={Page.HOME}>{t("page.not-found.go-back-home")}</Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
