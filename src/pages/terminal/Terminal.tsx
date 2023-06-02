import React, {
    createRef,
    useCallback,
    useEffect,
    useState
} from "react";
import "xterm/css/xterm.css";
import Xterm from "../../components/xterm/Xterm";
import {
    SerialPort,
    SerialPortState
} from "../../utils/serialport/SerialPort";

type Props = {
    serialPort: SerialPort;
    onClose: () => void;
};

const Terminal = ({ serialPort }: Props) => {
    const xtermRef: React.RefObject<Xterm> = createRef<Xterm>();
    const [error, setError] = useState<string | undefined>();

    const onResponse = useCallback(
        (data) => {
            xtermRef.current?.terminal.write(data);
        },
        [xtermRef]
    );

    useEffect(() => {
        if (serialPort) {
            serialPort
                .open(115200)
                .then(() => serialPort.addReader(onResponse))
                .then(() => serialPort.write(Buffer.from([0x18]))) // CTRL-X reset controller
                .then(() => serialPort.write(Buffer.from([0x14]))) // CTRL-T activate echo mode in FluidNC
                .then(() => serialPort.write(Buffer.from([0x05]))) // CTRL-E
                .catch((error) => {
                    console.log(error);
                    setError("Could not open a connection");
                });
        }

        return () => {
            if (
                serialPort &&
                serialPort.getState() === SerialPortState.CONNECTED
            ) {
                serialPort
                    .write(Buffer.from([0x0c])) // CTRL-L Restting echo mode
                    .then(() => serialPort.close());
            }

            serialPort.removeReader(onResponse);
        };
    }, [serialPort, onResponse, xtermRef]);

    return (
        <>
            {!error && (
                <Xterm
                    ref={xtermRef}
                    onData={(data) => serialPort.write(Buffer.from(data))}
                    options={{ cursorBlink: true, convertEol: true, cols: 72 }}
                />
            )}
            {error && <div className="alert alert-danger">{error}</div>}
        </>
    );
};

export default Terminal;
