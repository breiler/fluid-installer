import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./Header.scss";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faBook, faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { Dropdown, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { Language } from "../../i18n";

const logoUrl = new URL("../../assets/logo.svg", import.meta.url);

type FlagProps = {
    language: string;
};

const Flag = ({ language }: FlagProps) => {
    switch (language) {
        case "de":
            return <span className={"fi fi-de"}>&nbsp;</span>;
        case "en":
            return <span className={"fi fi-us"}>&nbsp;</span>;
        case "fr":
            return <span className={"fi fi-fr"}>&nbsp;</span>;
        case "sv":
            return <span className={"fi fi-se"}>&nbsp;</span>;
        case "nl":
            return <span className={"fi fi-nl"}>&nbsp;</span>;
        case "pt-BR":
            return <span className={"fi fi-br"}>&nbsp;</span>;
        case "pt-PT":
            return <span className={"fi fi-pt"}>&nbsp;</span>;
        case "ru":
            return <span className={"fi fi-ru"}>&nbsp;</span>;
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
        <Navbar expand="sm" bg="dark" data-bs-theme="dark" className="header">
            <Navbar.Brand href="./">
                <img src={logoUrl.toString()} alt="logo" width={100} />
            </Navbar.Brand>
            <Navbar.Toggle />

            <Navbar.Collapse className="justify-content-end">
                <Nav.Link
                    href="http://wiki.fluidnc.com/"
                    target="_blank"
                    className="nav-link active"
                >
                    <FontAwesomeIcon icon={faBook as IconDefinition} />{" "}
                    {t("header.documentation")}
                </Nav.Link>

                <Nav.Link
                    href="https://github.com/bdring/FluidNC"
                    target="_blank"
                    className="nav-link active"
                >
                    <FontAwesomeIcon icon={faGithub as IconDefinition} /> Github
                </Nav.Link>

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
                    <Dropdown.Divider />
                    <Dropdown.Item
                        href="https://crowdin.com/project/fluid-installer"
                        target="_blank"
                    >
                        <FontAwesomeIcon
                            icon={faExternalLink as IconDefinition}
                            style={{ marginRight: 10 }}
                        />
                        {t("header.translate")}
                    </Dropdown.Item>
                </NavDropdown>
            </Navbar.Collapse>
        </Navbar>
    );
};
export default Header;
