import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./Header.scss";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const logoUrl = new URL("../../assets/logo.svg", import.meta.url);

const Header = () => (
    <nav className="nav navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
            <a className="navbar-brand" href="./">
                <img src={logoUrl.toString()} alt="logo" width={100} />
            </a>

            <div className="navbar-nav">
                <a
                    className="nav-link active"
                    href="https://github.com/breiler/fluid-installer">
                    Github <FontAwesomeIcon icon={faGithub as IconDefinition} />
                </a>
            </div>
        </div>
    </nav>
);
export default Header;
