import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faCcPaypal, faGithubSquare } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const DonateCard = () => {
    const { t } = useTranslation();

    return (
        <Card style={{ backgroundColor: "#f0f0f0" }}>
            <Card.Body>
                <p className="small">{t("card.donate.description")}</p>

                <div className="d-flex justify-content-center">
                    <a
                        href="https://www.paypal.com/donate/?hosted_button_id=8DYLB6ZYYDG7Y"
                        target="_blank"
                        style={{ marginRight: 18 }}
                        rel="noreferrer"
                    >
                        <FontAwesomeIcon
                            icon={faCcPaypal as IconDefinition}
                            size="3x"
                            style={{ color: "#123984" }}
                        />
                    </a>

                    <a
                        href="https://github.com/sponsors/bdring"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FontAwesomeIcon
                            icon={faGithubSquare as IconDefinition}
                            size="3x"
                            style={{ color: "black" }}
                        />
                    </a>
                </div>
            </Card.Body>
        </Card>
    );
};

export default DonateCard;
