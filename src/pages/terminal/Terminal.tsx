import React, { createRef, useEffect, useState } from "react";
import "xterm/css/xterm.css";
import Xterm from "../../components/xterm/Xterm";
import { SerialPort, SerialPortState } from "../../utils/serialport/SerialPort";

type Props = {
    serialPort: SerialPort;
    onClose: () => void;
};

const Terminal = ({ serialPort }: Props) => {
    const xtermRef: React.RefObject<Xterm> = createRef<Xterm>();
    const [error, setError] = useState<string | undefined>();

    const onResponse = (data) => {
        xtermRef.current?.terminal.write(data);
    };

    useEffect(() => {
        if (serialPort) {
            serialPort
                .open(115200)
                .then(() => serialPort.addReader(onResponse))
                .then(() => serialPort.write(String.fromCharCode(0x18))) // CTRL-X reset controller
                .then(() => serialPort.write(String.fromCharCode(0x14))) // CTRL-T activate echo mode in FluidNC
                .then(() => serialPort.write(String.fromCharCode(0x05))) // CTRL-E
                .catch((error) => {
                    console.log(error);
                    setError("Could not open a connection");
                });
        }

        return () => {
            if (serialPort.getState() === SerialPortState.CONNECTED) {
                console.log("Closing connection");
                serialPort.write(String.fromCharCode(0x0c)); // CTRL-L Restting echo mode
                new Promise((f) => setTimeout(f, 1000)).then(() =>
                    serialPort.close()
                );
            }
        };
    }, [serialPort, xtermRef]);

    return (
        <>
            {!error && (
                <Xterm
                    ref={xtermRef}
                    onData={serialPort.write}
                    options={{ cursorBlink: true, convertEol: true }}
                />
            )}
            {error && <div className="alert alert-danger">{error}</div>}
        </>
    );
};

export default Terminal;
