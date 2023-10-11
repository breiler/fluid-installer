import React from "react";
import { useState } from "react";
import { Button } from "../../components";
import ConnectionState from "../../model/ConnectionState";
import { ControllerService } from "../../services";
import { SerialPort } from "../../utils/serialport/SerialPort";
import "./connection.scss";
import PageTitle from "../../components/pagetitle/PageTitle";
import usePageView from "../../hooks/usePageView";

const connectImageUrl = new URL("../../assets/connect.svg", import.meta.url);

type Props = {
    onConnect: (controllerService: ControllerService) => void;
};

const Connection = ({ onConnect }: Props) => {
    usePageView("Connection");
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [connectionState, setConnectionState] = useState<ConnectionState>(
        ConnectionState.DISCONNECTED
    );

    const connect = async () => {
        try {
            setErrorMessage(undefined);
            setConnectionState(ConnectionState.CONNECTING);
            const serialPortDevice = await (navigator as any).serial
                .requestPort()
                .then((port) => new SerialPort(port))
                .catch((error) => {
                    setConnectionState(ConnectionState.DISCONNECTED);
                    throw error;
                });

            const controllerService = new ControllerService(serialPortDevice);
            await controllerService.connect().catch((error) => {
                console.error(error);
                setErrorMessage(
                    "Could not establish connection to the controller. Please check that nothing else is connected to it"
                );
                setConnectionState(ConnectionState.DISCONNECTED);
                throw error;
            });

            setConnectionState(ConnectionState.CONNECTED);
            onConnect(controllerService);
        } catch (error) {
            //Never mind
        }
    };

    return (
        <div className="component-connection">
            {(connectionState === ConnectionState.DISCONNECTED ||
                connectionState === ConnectionState.CONNECTING) && (
                <>
                    <PageTitle>FluidNC Web Installer</PageTitle>
                    <p>
                        This tool will make it easy to install or upgrade
                        FluidNC on your controller. Plug in your controller and
                        press Connect to continue.
                    </p>
                    <div className="mx-auto" style={{ textAlign: "center" }}>
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
                        style={{ width: "460px", marginRight: "0px" }}
                        onClick={connect}
                        disabled={
                            connectionState === ConnectionState.CONNECTING
                        }
                        loading={connectionState === ConnectionState.CONNECTING}
                    >
                        <>
                            {connectionState === ConnectionState.CONNECTING &&
                                "Connecting"}
                            {connectionState === ConnectionState.DISCONNECTED &&
                                "Connect"}
                        </>
                    </Button>
                </div>
            )}
        </div>
    );
};
export default Connection;
