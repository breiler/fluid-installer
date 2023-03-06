import React from "react";
import { useState } from "react";
import { Button } from "../../components";
import ConnectionState from "../../model/ConnectionState";
import "./connection.scss";

const connectImageUrl = new URL("../../assets/connect.svg", import.meta.url);

type Props = {
    onConnect: (any) => void;
};

const Connection = ({ onConnect }: Props) => {
    const [errorMessage, setErrorMessage] = useState<string|undefined>();
    const [connectionState, setConnectionState] = useState<ConnectionState>(
        ConnectionState.DISCONNECTED
    );

    const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
    const connect = () => {
        setErrorMessage(undefined);
        setConnectionState(ConnectionState.CONNECTING);
        (navigator as any).serial
            .requestPort()
            .then((serialPortDevice) =>
                serialPortDevice.open({ baudRate: 115200 }).then(() => {
                    serialPortDevice.close();
                    setConnectionState(ConnectionState.CONNECTED);
                    onConnect(serialPortDevice);
                }).catch(error => {
                    setErrorMessage("Could not connect to selected serial port");
                    throw error;
                })
            )
            .catch(() => {
                setConnectionState(ConnectionState.DISCONNECTED);
            });
    };

    return (
        <div className="component-connection">
            {(connectionState === ConnectionState.DISCONNECTED ||
                connectionState === ConnectionState.CONNECTING) && (
                <>
                    <h2>FluidNC Web Installer</h2>
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

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {connectionState !== ConnectionState.CONNECTED && (
                <div className="mx-auto" style={{ textAlign: "center" }}>
                    <Button
                        style={{ width: "460px", marginRight: "0px" }}
                        onClick={connect}
                        disabled={
                            connectionState === ConnectionState.CONNECTING
                        }
                        loading={
                            connectionState === ConnectionState.CONNECTING
                        }>
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
