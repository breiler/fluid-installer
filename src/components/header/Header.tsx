import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./Header.scss";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faBook, faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { Dropdown, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { Language } from "../../i18n";
import { Link, useLocation } from "react-router-dom";
import Page from "../../model/Page";

const logoUrl = new URL("../../assets/logo.svg", import.meta.url);

type FlagProps = {
    language: string;
};

const Flag = ({ language }: FlagProps) => {
    switch (language) {
        case "de":
            return <span className={`fi fi-de`}>&nbsp;</span>;
        case "en":
            return <span className={"fi fi-us"}>&nbsp;</span>;
        case "es":
            return <span className={"fi fi-es"}>&nbsp;</span>;
        case "fr":
            return <span className={"fi fi-fr"}>&nbsp;</span>;
        case "sv":
            return <span className={"fi fi-se"}>&nbsp;</span>;
        case "nl":
            return <span className={"fi fi-nl"}>&nbsp;</span>;
        case "pl-PL":
            return <span className={"fi fi-pl"}>&nbsp;</span>;
        case "pt-BR":
            return <span className={"fi fi-br"}>&nbsp;</span>;
        case "pt-PT":
            return <span className={"fi fi-pt"}>&nbsp;</span>;
        case "uk":
            return <span className={"fi fi-ua"}>&nbsp;</span>;
        case "tr":
            return <span className={"fi fi-tr"}>&nbsp;</span>;
        case "it":
            return <span className={"fi fi-it"}>&nbsp;</span>;
        case "zh":
            return <span className={"fi fi-cn"}>&nbsp;</span>;
        default:
            return <span className={`fi fi-${language}`}>&nbsp;</span>;
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
    const location = useLocation();

    return (
        <Navbar
            expand="sm"
            bg="dark"
            data-bs-theme="dark"
            className="header"
            style={{ height: "60px" }}
        >
            <NavDropdown
                className="left"
                title={
                    <Navbar.Brand>
                        {(location.pathname.startsWith("/fluidnc") ||
                            location.pathname == "/") && (
                            <img
                                src={logoUrl.toString()}
                                alt="FluidNC logo"
                                width={100}
                            />
                        )}
                        {location.pathname.startsWith("/fluiddial") && (
                            <img
                                src={"/images/fluiddial.png"}
                                alt="FluidDial logo"
                                width={100}
                            />
                        )}
                    </Navbar.Brand>
                }
            >
                <Dropdown.Item as={Link} to={Page.HOME}>
                    Home
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item as={Link} to={Page.FLUIDNC_HOME}>
                    FluidNC
                </Dropdown.Item>
                <Dropdown.Item as={Link} to={Page.FLUID_DIAL_HOME}>
                    FluidDial
                </Dropdown.Item>
            </NavDropdown>

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

                <NavDropdown
                    className="right"
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
