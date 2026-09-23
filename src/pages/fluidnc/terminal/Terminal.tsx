import React, { useContext, useState } from "react";
import "@xterm/xterm/css/xterm.css";
import { GetStatusCommand } from "../../../services";
import { Button, Dropdown } from "react-bootstrap";
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

// Realtime override characters accepted by FluidNC, as listed in FluidTerm2's
// Ctrl-O "Send Override" menu.
const realtimeCommands: { code: number; label: string }[] = [
    { code: 0x84, label: "Safety Door" },
    { code: 0x85, label: "Jog Cancel" },
    { code: 0x86, label: "Debug Report" },
    { code: 0x87, label: "Macro 0" },
    { code: 0x88, label: "Macro 1" },
    { code: 0x89, label: "Macro 2" },
    { code: 0x8a, label: "Macro 3" },
    { code: 0x90, label: "Feed Override Reset" },
    { code: 0x91, label: "Feed Override Coarse +" },
    { code: 0x92, label: "Feed Override Coarse -" },
    { code: 0x93, label: "Feed Override Fine +" },
    { code: 0x94, label: "Feed Override Fine -" },
    { code: 0x95, label: "Rapid Override Reset" },
    { code: 0x96, label: "Rapid Override Medium" },
    { code: 0x97, label: "Rapid Override Low" },
    { code: 0x98, label: "Rapid Override Extra Low" },
    { code: 0x99, label: "Spindle Override Reset" },
    { code: 0x9a, label: "Spindle Override Coarse +" },
    { code: 0x9b, label: "Spindle Override Coarse -" },
    { code: 0x9c, label: "Spindle Override Fine +" },
    { code: 0x9d, label: "Spindle Override Fine -" },
    { code: 0x9e, label: "Spindle Override Stop" },
    { code: 0xa0, label: "Coolant Flood Override Toggle" },
    { code: 0xa1, label: "Coolant Mist Override Toggle" },
    { code: 0xc4, label: "Single Block Off" },
    { code: 0xc5, label: "Single Block On" }
];

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

    const onFeedHold = async () => {
        await controllerService.serialPort.writeChar(0x21); // ! Feed Hold
    };

    const onCycleStart = async () => {
        await controllerService.serialPort.writeChar(0x7e); // ~ Cycle Start
    };

    const onGetVersion = () => {
        controllerService?.send(new Command("$Build/Info"));
    };

    const onSendRealtime = async (code: number) => {
        await controllerService.serialPort.writeChar(code);
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
                    onClick={onFeedHold}
                    variant="secondary"
                    title={t("page.terminal.feedhold-description")}
                    disabled={isLoading}
                    style={buttonStyle}
                >
                    ! {t("page.terminal.feedhold")}
                </Button>
                <Button
                    onClick={onCycleStart}
                    variant="secondary"
                    title={t("page.terminal.cyclestart-description")}
                    disabled={isLoading}
                    style={buttonStyle}
                >
                    ~ {t("page.terminal.cyclestart")}
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
                <Dropdown style={{ display: "inline-block" }}>
                    <Dropdown.Toggle
                        variant="secondary"
                        disabled={isLoading}
                        title={t("page.terminal.realtime-description")}
                        style={buttonStyle}
                    >
                        {t("page.terminal.realtime")}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {realtimeCommands.map((cmd) => (
                            <Dropdown.Item
                                key={cmd.code}
                                onClick={() => onSendRealtime(cmd.code)}
                            >
                                {cmd.label} (0x
                                {cmd.code.toString(16).padStart(2, "0")})
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <TerminalComponent />
        </>
    );
};

export default Terminal;
