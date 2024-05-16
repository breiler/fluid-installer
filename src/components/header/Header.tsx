import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./Header.scss";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faBook } from "@fortawesome/free-solid-svg-icons";

const logoUrl = new URL("../../assets/logo.svg", import.meta.url);

const Header = () => (
    <nav className="header nav navbar navbar-expand navbar-dark bg-dark">
        <div className="container-fluid">
            <a className="navbar-brand" href="./">
                <img src={logoUrl.toString()} alt="logo" width={100} />
            </a>

            <div className="navbar-nav">
                <a
                    className="nav-link active"
                    href="http://wiki.fluidnc.com/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <FontAwesomeIcon icon={faBook as IconDefinition} />{" "}
                    Documentation
                </a>

                <a
                    className="nav-link active"
                    href="https://github.com/bdring/FluidNC"
                    target="_blank"
                    rel="noreferrer"
                >
                    <FontAwesomeIcon icon={faGithub as IconDefinition} /> Github
                </a>
            </div>
        </div>
    </nav>
);
export default Header;
