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
// Ctrl-O "Send Override" menu. `key` resolves to
// page.terminal.realtime-items.<key> in the translation files.
const realtimeCommands: { code: number; key: string }[] = [
    { code: 0x84, key: "safety-door" },
    { code: 0x85, key: "jog-cancel" },
    { code: 0x86, key: "debug-report" },
    { code: 0x87, key: "macro-0" },
    { code: 0x88, key: "macro-1" },
    { code: 0x89, key: "macro-2" },
    { code: 0x8a, key: "macro-3" },
    { code: 0x90, key: "feed-override-reset" },
    { code: 0x91, key: "feed-override-coarse-plus" },
    { code: 0x92, key: "feed-override-coarse-minus" },
    { code: 0x93, key: "feed-override-fine-plus" },
    { code: 0x94, key: "feed-override-fine-minus" },
    { code: 0x95, key: "rapid-override-reset" },
    { code: 0x96, key: "rapid-override-medium" },
    { code: 0x97, key: "rapid-override-low" },
    { code: 0x98, key: "rapid-override-extra-low" },
    { code: 0x99, key: "spindle-override-reset" },
    { code: 0x9a, key: "spindle-override-coarse-plus" },
    { code: 0x9b, key: "spindle-override-coarse-minus" },
    { code: 0x9c, key: "spindle-override-fine-plus" },
    { code: 0x9d, key: "spindle-override-fine-minus" },
    { code: 0x9e, key: "spindle-override-stop" },
    { code: 0xa0, key: "coolant-flood-override-toggle" },
    { code: 0xa1, key: "coolant-mist-override-toggle" }
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
                                {t(`page.terminal.realtime-items.${cmd.key}`)}{" "}
                                (0x
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
