import React, { useCallback } from "react";
import { useState } from "react";
import ConnectionState from "../../../model/ConnectionState";
import { SerialPort } from "../../../utils/serialport/SerialPort";
import "./connection.scss";
import PageTitle from "../../../components/pagetitle/PageTitle";
import usePageView from "../../../hooks/usePageView";
import { Container, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import useTrackEvent, {
    TrackAction,
    TrackCategory
} from "../../../hooks/useTrackEvent";

const connectImageUrl = new URL(
    "../../../assets/connect-fluiddial.svg",
    import.meta.url
);

type Props = {
    onConnect: (serialPort: SerialPort) => void;
};

const Connection = ({ onConnect }: Props) => {
    usePageView("FluidDial Connection");
    const { t } = useTranslation();
    const trackEvent = useTrackEvent();

    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [connectionState, setConnectionState] = useState<ConnectionState>(
        ConnectionState.DISCONNECTED
    );

    const connect = useCallback(async () => {
        try {
            setErrorMessage(undefined);
            setConnectionState(ConnectionState.CONNECTING);
            const serialPortDevice: SerialPort = await (navigator as any).serial // eslint-disable-line
                .requestPort()
                .then((port) => new SerialPort(port))
                .catch((error) => {
                    setConnectionState(ConnectionState.DISCONNECTED);
                    throw error;
                });
            const info = serialPortDevice.getNativeSerialPort().getInfo();
            trackEvent(
                TrackCategory.Connect,
                TrackAction.ConnectionStart,
                `[${info.usbProductId}, ${info.usbVendorId}]`
            );

            trackEvent(TrackCategory.Connect, TrackAction.ConnectionSuccess);
            setConnectionState(ConnectionState.CONNECTED);
            onConnect(serialPortDevice);
        } catch (_error) {
            //Never mind
        }
    }, [onConnect, trackEvent]);

    return (
        <Container>
            <div className="component-connection">
                {(connectionState === ConnectionState.DISCONNECTED ||
                    connectionState === ConnectionState.CONNECTING) && (
                    <>
                        <PageTitle>
                            {t("page.fluiddial.connection.title")}
                        </PageTitle>
                        <p>{t("page.fluiddial.connection.description")}</p>
                        <div
                            className="mx-auto"
                            style={{ textAlign: "center" }}
                        >
                            <img
                                className="image"
                                src={connectImageUrl.toString()}
                                alt="Connect"
                            />
                        </div>
                    </>
                )}

                {errorMessage && (
                    <div className="alert alert-danger">{errorMessage}</div>
                )}
                {connectionState !== ConnectionState.CONNECTED && (
                    <div className="mx-auto" style={{ textAlign: "center" }}>
                        <Button
                            style={{
                                width: "100%",
                                marginRight: "0px"
                            }}
                            onClick={connect}
                            disabled={
                                connectionState === ConnectionState.CONNECTING
                            }
                            size="lg"
                        >
                            <>
                                {connectionState ===
                                    ConnectionState.CONNECTING &&
                                    t("page.connection.connecting")}
                                {connectionState ===
                                    ConnectionState.DISCONNECTED &&
                                    t("page.connection.connect")}
                            </>
                        </Button>
                    </div>
                )}
            </div>
        </Container>
    );
};
export default Connection;
