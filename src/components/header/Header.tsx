import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./Header.scss";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { NavDropdown } from "react-bootstrap";
import { Language } from "../../i18n";

const logoUrl = new URL("../../assets/logo.svg", import.meta.url);

type FlagProps = {
    language: string;
};

const Flag = ({ language }: FlagProps) => {
    switch (language) {
        case "en":
            return <span className={"fi fi-us"}>&nbsp;</span>;
        case "sv":
            return <span className={"fi fi-se"}>&nbsp;</span>;
        case "nl":
            return <span className={"fi fi-nl"}>&nbsp;</span>;
    }
};

type LanguageDropDownProps = {
    language: string;
};
const LanguageDropDown = ({ language }: LanguageDropDownProps) => {
    const { i18n } = useTranslation();

    return (
        <NavDropdown.Item onClick={() => i18n.changeLanguage(language)}>
            <Flag language={language} />
            {Language[language]}
        </NavDropdown.Item>
    );
};

const Header = () => {
    const { t, i18n } = useTranslation();
    return (
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
                        {t("header.documentation")}
                    </a>

                    <a
                        className="nav-link active"
                        href="https://github.com/bdring/FluidNC"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FontAwesomeIcon icon={faGithub as IconDefinition} />{" "}
                        Github
                    </a>

                    <NavDropdown
                        title={
                            <>
                                <Flag language={i18n.resolvedLanguage} />
                                {Language[i18n.language]}
                            </>
                        }
                    >
                        {Object.keys(i18n.services.resourceStore.data).map(
                            (language) => (
                                <LanguageDropDown
                                    key={language}
                                    language={language}
                                />
                            )
                        )}
                    </NavDropdown>
                </div>
            </div>
        </nav>
    );
};
export default Header;
