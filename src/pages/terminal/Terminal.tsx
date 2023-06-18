import React, {
    createRef,
    useCallback,
    useContext,
    useEffect,
    useState
} from "react";
import "xterm/css/xterm.css";
import Xterm from "../../components/xterm/Xterm";
import { SerialPortState } from "../../utils/serialport/SerialPort";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ControllerServiceContext } from "../../context/ControllerServiceContext";
import { sleep } from "../../utils/utils";

type Props = {
    onClose: () => void;
};

const Terminal = ({ }: Props) => {
    const controllerService = useContext(ControllerServiceContext);
    const xtermRef: React.RefObject<Xterm> = createRef<Xterm>();
    const [error, setError] = useState<string | undefined>();

    const onResponse = useCallback(
        (data) => {
            xtermRef.current?.terminal.write(data);
        },
        [xtermRef]
    );

    useEffect(() => {
        if (controllerService) {
            console.log("initiating terminal");
            controllerService
                .connect()
                .then(() => controllerService
                    .serialPort.addReader(onResponse))
                .then(() => controllerService
                    .serialPort.write(Buffer.from([0x18]))) // CTRL-X reset controller
                .then(() => controllerService
                    .serialPort.write(Buffer.from([0x14]))) // CTRL-T activate echo mode in FluidNC
                .then(() => controllerService
                    .serialPort.write(Buffer.from([0x05]))) // CTRL-E
                .catch((error) => {
                    console.log(error);
                    setError("Could not open a connection");
                });
        }

        return () => {
            if (
                controllerService &&
                controllerService.serialPort.getState() === SerialPortState.CONNECTED
            ) {
                controllerService.serialPort
                    .write(Buffer.from([0x0c])); // CTRL-L Resetting echo mode
                controllerService.serialPort!.removeReader(onResponse);
            }

        };
    }, [controllerService, onResponse, xtermRef]);

    return (
        <>
            {!error && (
                <>
                    <div style={{ marginBottom: "16px" }}>
                        <Button
                            onClick={() =>
                                controllerService?.hardReset()
                                    .then(() => sleep(3000))
                                    .then(() => controllerService
                                        .serialPort.write(Buffer.from([0x14]))) // CTRL-T activate echo mode in FluidNC
                                    .then(() => controllerService
                                        .serialPort.write(Buffer.from([0x05]))) // CTRL-E
                            }
                            variant="danger"
                            title="Restart">
                            <FontAwesomeIcon
                                icon={faArrowsRotate as IconDefinition}
                            />
                        </Button>{" "}
                    </div>
                    <Xterm
                        ref={xtermRef}
                        onData={(data) => controllerService?.serialPort?.write(Buffer.from(data))}
                        options={{
                            cursorBlink: true,
                            convertEol: true,
                            cols: 72
                        }}
                    />
                </>
            )}
            {error && <div className="alert alert-danger">{error}</div>}
        </>
    );
};

export default Terminal;
