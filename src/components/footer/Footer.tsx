import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faBook, faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./Footer.scss";
import { useTranslation } from "react-i18next";
import usePopupTerminalStore from "../../store/PopupTerminalStore";
import { faTerminal } from "@fortawesome/free-solid-svg-icons/faTerminal";
import { Button } from "react-bootstrap";

const Footer = () => {
    const { t } = useTranslation();
    const { showPopupTerminal, setShowPopupTerminal, isConnected } =
        usePopupTerminalStore();

    return (
        <footer className="footer page-footer font-small blue pt-4">
            <ul className="list-unstyled d-flex align-items-center mb-0">
                <li className="me-3">
                    <a
                        href="http://wiki.fluidnc.com/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {" "}
                        <FontAwesomeIcon icon={faBook as IconDefinition} />{" "}
                        {t("footer.documentation")}
                    </a>
                </li>
                <li className="me-3">
                    <a
                        href="https://discord.gg/j29vtknJnU"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FontAwesomeIcon icon={faDiscord as IconDefinition} />{" "}
                        Discord
                    </a>
                </li>
                <li className="me-3">
                    <a
                        href="https://github.com/bdring/FluidNC"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FontAwesomeIcon icon={faGithub as IconDefinition} />{" "}
                        FluidNC
                    </a>
                </li>
                <li className="me-3">
                    <a
                        href="https://github.com/bdring/FluidDial"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FontAwesomeIcon icon={faGithub as IconDefinition} />{" "}
                        FluidDial
                    </a>
                </li>
                <li className="me-3">
                    <a
                        href="https://github.com/breiler/fluid-installer"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FontAwesomeIcon icon={faGithub as IconDefinition} />{" "}
                        Installer
                    </a>
                </li>
                <li className="me-3">
                    <a
                        href="https://crowdin.com/project/fluid-installer"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FontAwesomeIcon
                            icon={faExternalLink as IconDefinition}
                        />{" "}
                        {t("header.translate")}
                    </a>
                </li>
                {isConnected && (
                    <li className="ms-auto" style={{ marginRight: "20px" }}>
                        <Button
                            variant="secondary"
                            onClick={() =>
                                setShowPopupTerminal(!showPopupTerminal)
                            }
                        >
                            <FontAwesomeIcon
                                icon={faTerminal as IconDefinition}
                            />
                        </Button>
                    </li>
                )}
            </ul>
        </footer>
    );
};

export default Footer;
