import { useContext, useEffect, useRef, useState } from "react";
import Xterm from "../xterm/Xterm";
import { ControllerServiceContext } from "../../context/ControllerServiceContext";
import { ControllerStatus } from "../../services";
import { SerialPortState } from "../../utils/serialport/SerialPort";
import React from "react";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

const decoder = new TextDecoder();
const COLOR_RED = "\x1b[91m";
const COLOR_GREEN = "\x1b[92m";
const COLOR_GRAY = "\x1b[37m";
const COLOR_YELLOW = "\x1b[93m";

const colorizeData = (data: string) => {
    data = data.replace(/MSG:ERR/g, COLOR_RED + "$&" + COLOR_GRAY);
    data = data.replace(/MSG:INFO/g, COLOR_GREEN + "$&" + COLOR_GRAY);
    data = data.replace(/MSG:WARN/g, COLOR_YELLOW + "$&" + COLOR_GRAY);
    data = data.replace(/MSG:DBG/g, COLOR_YELLOW + "$&" + COLOR_GRAY);
    data = data.replace(/<Alarm/g, "<" + COLOR_RED + "Alarm" + COLOR_GRAY);
    data = data.replace(/<Run/g, "<" + COLOR_GREEN + "Run" + COLOR_GRAY);
    data = data.replace(/<Idle/g, "<" + COLOR_GREEN + "Idle" + COLOR_GRAY);
    data = data.replace(/error:/g, COLOR_RED + "error:" + COLOR_GRAY);
    return data;
};

const useTerminalInputFilter = (consume: (data: string) => void) => {
    // Buffer data locally
    const [data, setData] = useState<string>("");
    const onData = (data: Buffer) => {
        setData((d) => d + decoder.decode(data));
    };

    // Debounce value, colorize it and then dispatch to consumer
    const debouncedValue = useDebouncedValue(data, 100);
    useEffect(() => {
        if (debouncedValue) {
            setData("");
            consume(colorizeData(debouncedValue));
        }
    }, [debouncedValue]);

    return onData;
};

export const TerminalComponent = () => {
    const xtermRef: React.RefObject<Xterm> = useRef<Xterm | undefined>();
    const controllerService = useContext(ControllerServiceContext);

    // Creates a reader that will will colorize the data and write it to the terminal
    const reader = useTerminalInputFilter((data) =>
        xtermRef?.current?.terminal?.write(data)
    );

    useEffect(() => {
        if (
            controllerService &&
            controllerService.status == ControllerStatus.CONNECTED
        ) {
            try {
                controllerService.serialPort.writeChar(0x05); // CTRL-E
                const savedData = controllerService.serialPort.getSavedData();
                savedData.forEach(reader);
                controllerService.serialPort.addReader(reader);
            } catch (error) {
                console.log(error);
            }
        }

        return () => {
            if (
                controllerService &&
                controllerService.serialPort.getState() ===
                    SerialPortState.CONNECTED
            ) {
                controllerService.serialPort!.removeReader(reader);
                controllerService.serialPort.writeChar(0x0c); // CTRL-L Resetting echo mode
            }
        };
    }, []);

    return (
        <Xterm
            ref={xtermRef}
            onData={(data) =>
                controllerService?.serialPort?.write(Buffer.from(data))
            }
            options={{
                cursorBlink: true,
                convertEol: true
            }}
        />
    );
};
