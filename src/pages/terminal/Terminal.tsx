import React, { createRef, useEffect, useState } from "react";
import "xterm/css/xterm.css";
import { Button } from "../../components";
import Xterm from "../../components/xterm/Xterm";
import { SerialPort, SerialPortState } from "../../utils/serialport/SerialPort";

type Props = {
    serialPort: SerialPort;
    onClose: () => void;
};

const Terminal = ({ serialPort, onClose }: Props) => {
    const xtermRef: React.RefObject<Xterm> = createRef<Xterm>();
    const [error, setError] = useState();

    const onResponse = (data) => {
        xtermRef.current?.terminal.write(data);
    };

    useEffect(() => {
        if (serialPort) {
            serialPort
                .open(115200)
                .then(() => serialPort.addReader(onResponse))
                .then(() => serialPort.write(String.fromCharCode(0x18)))
                .then(() => serialPort.write(String.fromCharCode(0x05)))
                .catch((error) => setError(error));
        }

        return () => {
            if (serialPort.getState() === SerialPortState.CONNECTED) {
                console.log("Closing connection");
                serialPort.write(String.fromCharCode(0x0c));
                new Promise((f) => setTimeout(f, 1000)).then(() => serialPort.close());
            }
        };
    }, [serialPort, xtermRef]);

    return (
        <>
            {!error && (
                <Xterm
                    ref={xtermRef}
                    onData={serialPort.write}
                    options={{ cursorBlink: true }}
                />
            )}
            {error && { error }}
        </>
    );
};

export default Terminal;
