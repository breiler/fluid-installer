import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./Footer.scss";

const Footer = () => {
    return (
        <footer className="footer page-footer font-small blue pt-4">
            <ul className="list-unstyled text-start">
                <li>
                    <a href="http://wiki.fluidnc.com/">
                        {" "}
                        <FontAwesomeIcon icon={faBook as IconDefinition} />{" "}
                        Documentation
                    </a>
                </li>
                <li>
                    <a href="https://github.com/bdring/FluidNC">
                        <FontAwesomeIcon icon={faGithub as IconDefinition} />{" "}
                        FluidNC
                    </a>
                </li>
                <li>
                    <a href="https://github.com/breiler/fluid-installer">
                        <FontAwesomeIcon icon={faGithub as IconDefinition} />{" "}
                        Installer
                    </a>
                </li>
            </ul>
        </footer>
    );
};

export default Footer;
