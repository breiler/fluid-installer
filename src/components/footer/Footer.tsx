import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faBook, faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./Footer.scss";
import { useTranslation } from "react-i18next";

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="footer page-footer font-small blue pt-4">
            <ul className="list-unstyled text-start">
                <li>
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
                <li>
                    <a
                        href="https://discord.gg/j29vtknJnU"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FontAwesomeIcon icon={faDiscord as IconDefinition} />{" "}
                        Discord
                    </a>
                </li>
                <li>
                    <a
                        href="https://github.com/bdring/FluidNC"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FontAwesomeIcon icon={faGithub as IconDefinition} />{" "}
                        FluidNC
                    </a>
                </li>
                <li>
                    <a
                        href="https://github.com/breiler/fluid-installer"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FontAwesomeIcon icon={faGithub as IconDefinition} />{" "}
                        Installer
                    </a>
                </li>
                <li>
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
            </ul>
        </footer>
    );
};

export default Footer;
