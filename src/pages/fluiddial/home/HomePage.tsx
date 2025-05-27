import React, { useContext, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { FlashFile, flashDevice } from "../../../utils/flash";
import { SerialPortContext } from "../../../context/SerialPortContext";
import { InstallerState } from "../../../services";
import { FlashProgress } from "../../../services/FlashService";
import { useTranslation } from "react-i18next";
import Log from "../../../components/log/Log";
import BootloaderInfo from "../../../panels/bootloaderinfo/BootloaderInfo";
import { Progress } from "../../../panels";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import Page from "../../../model/Page";

const FluidDialHomePage = () => {
    const navigate = useNavigate();

    const [state, setInstallerState] = useState<InstallerState | undefined>();
    const [progress, setProgress] = useState<FlashProgress | undefined>();
    const [log, setLog] = useState("");
    const [showLog, setShowLog] = useState<boolean>(false);
    const [errorMessage] = useState<string | undefined>();

    const { t } = useTranslation();

    const onLogData = (data: string) => {
        setLog((l) => l + data);
    };

    const serialPort = useContext(SerialPortContext);
    const flash = async (imageUrl: string) => {
        const data: Uint8Array = await fetch(imageUrl, {
            headers: {
                Accept: "application/octet-stream"
            }
        })
            .then((response) => {
                if (response.status === 200 || response.status === 0) {
                    return response.arrayBuffer();
                } else {
                    return Promise.reject(new Error(response.statusText));
                }
            })
            .then((buffer) => new Uint8Array(buffer));

        const files: FlashFile[] = [
            {
                fileName: "file",
                data: data,
                address: 0x0
            }
        ];

        await flashDevice(
            serialPort.getNativeSerialPort(),
            files,
            true,
            921600,
            setProgress,
            setInstallerState,
            onLogData
        );

        setInstallerState(InstallerState.DONE);
    };

    return (
        <>
            {!state && (
                <>
                    <h3>FluidDial</h3>
                    <p>Select what device to flash</p>
                    <div style={{ marginBottom: "20px" }}>
                        <Button
                            onClick={() =>
                                flash("fluiddial/1.0.0/FluidDial_cyd.bin")
                            }
                            style={{ marginRight: "20px" }}
                        >
                            Flash CYD
                        </Button>
                        <Button
                            onClick={() =>
                                flash("fluiddial/1.0.0/FluidDial_m5dial.bin")
                            }
                        >
                            Flash M5Dial
                        </Button>
                    </div>
                    <p>
                        <Link to={Page.HOME}>Go back home</Link>
                    </p>
                </>
            )}
            {!!state && (
                <>
                    {(state === InstallerState.DOWNLOADING ||
                        state === InstallerState.CHECKING_SIGNATURES) && (
                        <>
                            <h3>{t("modal.installer.downloading")}</h3>
                            <p>
                                {t("modal.installer.downloading-description")}{" "}
                                <Spinner />
                            </p>
                            <Log show={showLog} onShow={setShowLog}>
                                {log}
                            </Log>
                        </>
                    )}

                    {state === InstallerState.ENTER_FLASH_MODE && (
                        <>
                            <BootloaderInfo />
                            <Log show={showLog} onShow={setShowLog}>
                                {log}
                            </Log>
                        </>
                    )}

                    {state === InstallerState.FLASHING && (
                        <>
                            <Progress progress={progress} status={state} />
                            <Log show={showLog} onShow={setShowLog}>
                                {log}
                            </Log>
                        </>
                    )}

                    {state === InstallerState.RESTARTING && (
                        <>
                            <h3>{t("modal.installer.restarting")}</h3>
                            <>
                                {t("modal.installer.restarting-description")}{" "}
                                <Spinner />
                            </>
                            <Log show={showLog} onShow={setShowLog}>
                                {log}
                            </Log>
                        </>
                    )}

                    {state === InstallerState.DONE && (
                        <>
                            <h3>{t("modal.installer.done")}</h3>
                            <p>{t("modal.installer.done-description")}</p>
                            <Log show={showLog} onShow={setShowLog}>
                                {log}
                            </Log>
                            <Button
                                onClick={() => navigate(Page.HOME)}
                                style={{ marginTop: "20px" }}
                            >
                                Go back
                            </Button>
                        </>
                    )}

                    {state === InstallerState.ERROR && (
                        <>
                            <h3>{t("modal.installer.error")}</h3>
                            <div className="alert alert-danger">
                                <FontAwesomeIcon
                                    icon={faBan as IconDefinition}
                                />{" "}
                                {errorMessage}
                            </div>
                            <Log show={showLog} onShow={setShowLog}>
                                {log}
                            </Log>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default FluidDialHomePage;
