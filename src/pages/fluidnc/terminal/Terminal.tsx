import React, {
    createRef,
    useCallback,
    useContext,
    useEffect,
    useState
} from "react";
import "@xterm/xterm/css/xterm.css";
import Xterm from "../../../components/xterm/Xterm";
import { SerialPortState } from "../../../utils/serialport/SerialPort";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowsRotate,
    faCodeBranch,
    faLockOpen,
    faPowerOff,
    faQuestion,
    faSquarePollHorizontal
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ControllerServiceContext } from "../../../context/ControllerServiceContext";
import SpinnerModal from "../../../modals/spinnermodal/SpinnerModal";
import PageTitle from "../../../components/pagetitle/PageTitle";
import usePageView from "../../../hooks/usePageView";
import { Command } from "../../../services";
import { useTranslation } from "react-i18next";

const decoder = new TextDecoder();
let buffer = "";
let timer: ReturnType<typeof setTimeout> | undefined = undefined;

const COLOR_RED = "\x1b[91m";
const COLOR_GREEN = "\x1b[92m";
const COLOR_GRAY = "\x1b[37m";
const COLOR_YELLOW = "\x1b[93m";

/**
 * A function for writing the data to the terminal.
 * It will buffer the data for 100ms and style the input with colors.
 *
 * @param data
 * @param terminal
 */
const handleTerminalInput = (
    data: ArrayBuffer,
    write: (data: string) => void
) => {
    buffer = buffer + decoder.decode(data);
    if (timer) {
        clearTimeout(timer);
    }

    timer = setTimeout(() => {
        buffer = buffer.replace(/MSG:ERR/g, COLOR_RED + "$&" + COLOR_GRAY);
        buffer = buffer.replace(/MSG:INFO/g, COLOR_GREEN + "$&" + COLOR_GRAY);
        buffer = buffer.replace(/MSG:WARN/g, COLOR_YELLOW + "$&" + COLOR_GRAY);
        buffer = buffer.replace(/MSG:DBG/g, COLOR_YELLOW + "$&" + COLOR_GRAY);
        buffer = buffer.replace(
            /<Alarm/g,
            "<" + COLOR_RED + "Alarm" + COLOR_GRAY
        );
        buffer = buffer.replace(
            /<Run/g,
            "<" + COLOR_GREEN + "Run" + COLOR_GRAY
        );
        buffer = buffer.replace(
            /<Idle/g,
            "<" + COLOR_GREEN + "Idle" + COLOR_GRAY
        );
        buffer = buffer.replace(/error:/g, COLOR_RED + "error:" + COLOR_GRAY);
        write(buffer);
        buffer = "";
        timer = undefined;
    }, 100);
};

const buttonStyle = { marginBottom: "16px", marginRight: "16px" };

const Terminal = () => {
    usePageView("Terminal");
    const { t } = useTranslation();
    const controllerService = useContext(ControllerServiceContext);
    const xtermRef: React.RefObject<Xterm> = createRef<Xterm>();
    const [error, setError] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onResponse = useCallback(
        (data) => {
            xtermRef.current?.terminal &&
                handleTerminalInput(data, (data) =>
                    xtermRef.current?.terminal.write(data)
                );
        },
        [xtermRef]
    );

    useEffect(() => {
        if (controllerService) {
            controllerService
                .connect()
                .then(() => controllerService.serialPort.addReader(onResponse))
                .then(() =>
                    controllerService.serialPort.write(Buffer.from([0x18]))
                ) // CTRL-X reset controller
                .then(() =>
                    controllerService.serialPort.write(Buffer.from([0x14]))
                ) // CTRL-T activate echo mode in FluidNC
                .then(() =>
                    controllerService.serialPort.write(Buffer.from([0x05]))
                ) // CTRL-E
                .catch((error) => {
                    console.log(error);
                    setError("Could not open a connection");
                });
        }

        return () => {
            if (
                controllerService &&
                controllerService.serialPort.getState() ===
                    SerialPortState.CONNECTED
            ) {
                controllerService.serialPort.write(Buffer.from([0x0c])); // CTRL-L Resetting echo mode
                controllerService.serialPort!.removeReader(onResponse);
            }
        };
    }, [controllerService, onResponse, xtermRef]);

    const onRestart = () => {
        setIsLoading(true);
        controllerService
            ?.hardReset()
            .then(() => controllerService.serialPort.write(Buffer.from([0x14]))) // CTRL-T activate echo mode in FluidNC
            .then(() => controllerService.serialPort.write(Buffer.from([0x05]))) // CTRL-E
            .finally(() => setIsLoading(false));
        xtermRef.current?.terminal.focus();
    };

    const onReset = () => {
        controllerService.serialPort.write(Buffer.from([0x18]));
    };

    const onUnlock = () => {
        controllerService?.send(new Command("$X"));
    };

    const onGetStatus = () => {
        controllerService?.send(new Command("?"));
    };

    const onGetStartupMessages = () => {
        controllerService?.send(new Command("$Startup/Show"));
    };

    const onGetVersion = () => {
        controllerService?.send(new Command("$Build/Info"));
    };

    return (
        <>
            <PageTitle>{t("page.terminal.title")}</PageTitle>
            <SpinnerModal
                show={isLoading}
                text={t("page.terminal.restarting")}
            />
            {!error && (
                <>
                    <div>
                        <Button
                            onClick={onRestart}
                            variant="danger"
                            title={t("page.terminal.restart-description")}
                            disabled={isLoading}
                            style={buttonStyle}
                        >
                            <FontAwesomeIcon
                                icon={faPowerOff as IconDefinition}
                            />{" "}
                            {t("page.terminal.restart")}
                        </Button>
                        <Button
                            onClick={onReset}
                            variant="warning"
                            title={t("page.terminal.reset-description")}
                            disabled={isLoading}
                            style={buttonStyle}
                        >
                            <FontAwesomeIcon
                                icon={faArrowsRotate as IconDefinition}
                            />{" "}
                            {t("page.terminal.reset")}
                        </Button>
                        <Button
                            onClick={onUnlock}
                            variant="secondary"
                            title={t("page.terminal.unlock-description")}
                            disabled={isLoading}
                            style={buttonStyle}
                        >
                            <FontAwesomeIcon
                                icon={faLockOpen as IconDefinition}
                            />{" "}
                            {t("page.terminal.unlock")}
                        </Button>
                        <Button
                            onClick={onGetStatus}
                            variant="secondary"
                            title={t("page.terminal.status-description")}
                            disabled={isLoading}
                            style={buttonStyle}
                        >
                            <FontAwesomeIcon
                                icon={faQuestion as IconDefinition}
                            />{" "}
                            {t("page.terminal.status")}
                        </Button>

                        <Button
                            onClick={onGetStartupMessages}
                            variant="secondary"
                            title={t("page.terminal.startup-description")}
                            disabled={isLoading}
                            style={buttonStyle}
                        >
                            <FontAwesomeIcon
                                icon={faSquarePollHorizontal as IconDefinition}
                            />{" "}
                            {t("page.terminal.startup")}
                        </Button>

                        <Button
                            onClick={onGetVersion}
                            variant="secondary"
                            title={t("page.terminal.version-description")}
                            disabled={isLoading}
                            style={buttonStyle}
                        >
                            <FontAwesomeIcon
                                icon={faCodeBranch as IconDefinition}
                            />{" "}
                            {t("page.terminal.version")}
                        </Button>
                    </div>
                    <Xterm
                        ref={xtermRef}
                        onData={(data) =>
                            controllerService?.serialPort?.write(
                                Buffer.from(data)
                            )
                        }
                        options={{
                            cursorBlink: true,
                            convertEol: true
                        }}
                    />
                </>
            )}
            {error && <div className="alert alert-danger">{error}</div>}
        </>
    );
};

export default Terminal;
