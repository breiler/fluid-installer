import React from "react";
import Status from "../../model/Status";
import "./Header.scss";

const logoUrl = new URL("../../assets/logo.svg", import.meta.url);
const githubLogoUrl = new URL("../../assets/gh-logo.svg", import.meta.url);

const Header = () => {
    return (
        <nav className="nav navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="./">
                    <img src={logoUrl.toString()} alt="logo" width={100} />
                </a>

                <div className="navbar-nav">
                    <a
                        className="nav-link active"
                        href="https://github.com/breiler/fluid-installer">
                        Github{" "}
                        <img src={githubLogoUrl.toString()} alt="github" />
                    </a>
                </div>
            </div>
        </nav>
    );
};
export default Header;
