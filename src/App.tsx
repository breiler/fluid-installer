import React, { useState } from "react";

import { Header } from "./components";
import Page from "./model/Page";
import { Installer, Terminal } from "./pages";
import FileBrowser from "./pages/filebrowser";
import SelectMode from "./pages/selectmode";
import { Connection } from "./panels";
import { SerialPort, SerialPortEvent } from "./utils/serialport/SerialPort";
import { isSafari } from "./utils/utils";
import { SerialPortContext } from "./context/SerialPortContext";
import ConfigurationPage from "./pages/configurationpage";

const App = () => {
    const [page, setPage] = useState<Page | undefined>(undefined);
    if (isSafari()) {
        return <h1>This tool is not supported on Safari!</h1>;
    }
    const [serialPort, setSerialPort] = useState<SerialPort>();

    const onConnect = (port) => {
        const serialPort = new SerialPort(port);

        // Registers a listener which
        serialPort.on(SerialPortEvent.CONNECTION_ERROR, () => {
            setSerialPort(undefined);
            setPage(undefined);
        });
        setSerialPort(serialPort);
    };

    return (
        <>
            <SerialPortContext.Provider value={serialPort}>
                <Header />
                <div className="container">
                    {!serialPort && <Connection onConnect={onConnect} />}
                    {serialPort && !page && <SelectMode onSelect={setPage} />}

                    {serialPort && page && (
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

                    {serialPort && page === Page.INSTALLER && (
                        <Installer onClose={() => setPage(undefined)} />
                    )}

                    {serialPort && page === Page.TERMINAL && (
                        <Terminal onClose={() => setPage(undefined)} />
                    )}

                    {page === Page.CONFIGURATION && <ConfigurationPage />}

                    {serialPort && page === Page.FILEBROWSER && <FileBrowser />}
                </div>
            </SerialPortContext.Provider>
        </>
    );
};

export default App;
