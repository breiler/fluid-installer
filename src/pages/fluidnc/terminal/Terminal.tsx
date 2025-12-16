import React, { useContext, useState } from "react";
import "@xterm/xterm/css/xterm.css";
import { GetStatusCommand } from "../../../services";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowsRotate,
    faCodeBranch,
    faLockOpen,
    faPowerOff,
    faQuestion
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ControllerServiceContext } from "../../../context/ControllerServiceContext";
import PageTitle from "../../../components/pagetitle/PageTitle";
import usePageView from "../../../hooks/usePageView";
import { Command } from "../../../services";
import { useTranslation } from "react-i18next";
import { TerminalComponent } from "../../../components/terminalcomponent/TerminalComponent";

const buttonStyle = { marginBottom: "16px", marginRight: "16px" };

const Terminal = () => {
    usePageView("Terminal");
    const { t } = useTranslation();
    const controllerService = useContext(ControllerServiceContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onRestart = async () => {
        setIsLoading(true);
        await controllerService.hardReset();
        await controllerService.serialPort.writeChar(0x05); // CTRL-E
        await controllerService.serialPort.writeChar(0x3f); // ? get status
        setIsLoading(false);
    };

    const onReset = async () => {
        await controllerService.serialPort.writeChar(0x18); // CTRL-X Grbl reset
    };

    const onUnlock = async () => {
        await controllerService?.send(new Command("$X"));
    };

    const onGetStatus = async () => {
        await controllerService.send(new GetStatusCommand());
    };

    const onGetVersion = () => {
        controllerService?.send(new Command("$Build/Info"));
    };

    return (
        <>
            <PageTitle>{t("page.terminal.title")}</PageTitle>
            <div>
                <Button
                    onClick={onRestart}
                    variant="danger"
                    title={t("page.terminal.restart-description")}
                    disabled={isLoading}
                    style={buttonStyle}
                >
                    <FontAwesomeIcon icon={faPowerOff as IconDefinition} />{" "}
                    {t("page.terminal.restart")}
                </Button>
                <Button
                    onClick={onReset}
                    variant="warning"
                    title={t("page.terminal.reset-description")}
                    disabled={isLoading}
                    style={buttonStyle}
                >
                    <FontAwesomeIcon icon={faArrowsRotate as IconDefinition} />{" "}
                    {t("page.terminal.reset")}
                </Button>
                <Button
                    onClick={onUnlock}
                    variant="secondary"
                    title={t("page.terminal.unlock-description")}
                    disabled={isLoading}
                    style={buttonStyle}
                >
                    <FontAwesomeIcon icon={faLockOpen as IconDefinition} />{" "}
                    {t("page.terminal.unlock")}
                </Button>
                <Button
                    onClick={onGetStatus}
                    variant="secondary"
                    title={t("page.terminal.status-description")}
                    disabled={isLoading}
                    style={buttonStyle}
                >
                    <FontAwesomeIcon icon={faQuestion as IconDefinition} />{" "}
                    {t("page.terminal.status")}
                </Button>
                <Button
                    onClick={onGetVersion}
                    variant="secondary"
                    title={t("page.terminal.version-description")}
                    disabled={isLoading}
                    style={buttonStyle}
                >
                    <FontAwesomeIcon icon={faCodeBranch as IconDefinition} />{" "}
                    {t("page.terminal.version")}
                </Button>
            </div>
            <TerminalComponent />
        </>
    );
};

export default Terminal;
