import React from "react";
import PageTitle from "../../components/pagetitle/PageTitle";
import { Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const Unsupported = () => {
    const { t } = useTranslation();

    return (
        <Container>
            <Row>
                <PageTitle>{t("panel.unsupported.title")}</PageTitle>
                <p>{t("panel.unsupported.description")}</p>
            </Row>
        </Container>
    );
};

export default Unsupported;
