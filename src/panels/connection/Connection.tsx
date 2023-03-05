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
    const [connectionState, setConnectionState] = useState<ConnectionState>(
        ConnectionState.DISCONNECTED
    );

    
    const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
    const connect = () => {
        setConnectionState(ConnectionState.CONNECTING);
        (navigator as any).serial
            .requestPort()
            .then((serialPortDevice) => {
                onConnect(serialPortDevice);
            })
            .catch(() => {
                setConnectionState(ConnectionState.DISCONNECTED);
            })
            .finally(() => {
                setConnectionState(ConnectionState.CONNECTED);
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
