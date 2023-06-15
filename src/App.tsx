import React, { useEffect, useState } from "react";

import { Header, Spinner } from "./components";
import Page from "./model/Page";
import { Installer, Terminal } from "./pages";
import FileBrowser from "./pages/filebrowser";
import SelectMode from "./pages/selectmode";
import { Connection } from "./panels";
import { SerialPort, SerialPortEvent } from "./utils/serialport/SerialPort";
import { isSafari } from "./utils/utils";
import { ControllerService } from "./services/controllerservice";
import { ControllerServiceContext } from "./context/ControllerServiceContext";
import SpinnerModal from "./components/spinnermodal/SpinnerModal";
import { ControllerStatus } from "./services/controllerservice/ControllerService";

const App = () => {
    const [page, setPage] = useState<Page | undefined>(undefined);
    if (isSafari()) {
        return <h1>This tool is not supported on Safari!</h1>;
    }
    const [serialPort, setSerialPort] = useState<SerialPort>();
    const [controllerService, setControllerService] = useState<ControllerService>();

    const onConnect = (port) => {
        const serialPort = new SerialPort(port);

        // Registers a listener which
        serialPort.on(SerialPortEvent.CONNECTION_ERROR, () => {
            setSerialPort(undefined);
            setPage(undefined);
        });
        setSerialPort(serialPort);
    };

    useEffect(() => {
        if (serialPort) {
            const timeout = setTimeout(() => {
                const service = new ControllerService(serialPort);
                service.connect().then(() => setControllerService(service)).catch(error =>
                    console.log("Could not connect", error));
            }, 1000);

            return () => clearTimeout(timeout);
        } else {
            setControllerService(undefined);
        }
    }, [serialPort]);

    return (
        <>
            <ControllerServiceContext.Provider value={controllerService}>
                <Header />
                <div className="container">
                    {!serialPort && <Connection onConnect={onConnect} />}
                    {serialPort && !controllerService && <SpinnerModal show={true} text="Connecting to controller..." />}
                    {controllerService && !page && <SelectMode onSelect={setPage} />}

                    {controllerService && page && (
                        <>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <a
                                            href="#"
                                            onClick={() => setPage(undefined)}>
                                            Home
                                        </a>
                                    </li>
                                    <li
                                        className="breadcrumb-item active"
                                        aria-current="page">
                                        {page}
                                    </li>
                                </ol>
                            </nav>
                            <hr />
                        </>
                    )}

                    {controllerService && page === Page.INSTALLER && (
                        <Installer onClose={() => setPage(undefined)} />
                    )}

                    {controllerService && page === Page.TERMINAL && (
                        <Terminal onClose={() => setPage(undefined)} />
                    )}

                    {controllerService && page === Page.FILEBROWSER && <FileBrowser />}
                </div>
            </ControllerServiceContext.Provider>
        </>
    );
};

export default App;
