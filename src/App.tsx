import React, { useState } from "react";

import { Header } from "./components";
import Page from "./model/Page";
import { Installer, Terminal } from "./pages";
import FileBrowser from "./pages/filebrowser";
import SelectMode from "./pages/selectmode";
import { Connection } from "./panels";
import { SerialPort } from "./utils/serialport/SerialPort";
import { isSafari } from "./utils/utils";

const App = () => {
    const [page, setPage] = useState<Page | undefined>(undefined);
    if (isSafari()) {
        return <h1>This tool is not supported on Safari!</h1>;
    }
    const [serialPort, setSerialPort] = useState<SerialPort>();

    const onConnect = (port) => {
        setSerialPort(new SerialPort(port));
    };

    return (
        <>
            <Header />
            <div className="container">
                {!serialPort && <Connection onConnect={onConnect} />}
                {serialPort && !page && <SelectMode onSelect={setPage} serialPort={serialPort} />}
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
                    <Installer
                        serialPort={serialPort}
                        onClose={() => setPage(undefined)}
                    />
                )}
                {serialPort && page === Page.TERMINAL && (
                    <Terminal
                        serialPort={serialPort}
                        onClose={() => setPage(undefined)}
                    />
                )}
                {serialPort && page === Page.FILEBROWSER && <FileBrowser serialPort={serialPort}/>}
            </div>
        </>
    );
};

export default App;
