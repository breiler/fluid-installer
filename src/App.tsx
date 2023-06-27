import React, { useEffect, useState } from "react";

import { Header } from "./components";
import Page from "./model/Page";
import { Installer, Terminal } from "./pages";
import FileBrowser from "./pages/filebrowser";
import SelectMode from "./pages/selectmode";
import { Connection } from "./panels";
import { isSafari } from "./utils/utils";
import { ControllerService, ControllerStatus } from "./services";
import { ControllerServiceContext } from "./context/ControllerServiceContext";
import { Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const App = () => {
    const [page, setPage] = useState<Page | undefined>(undefined);
    if (isSafari()) {
        return <h1>This tool is not supported on Safari!</h1>;
    }
    const [controllerService, setControllerService] = useState<ControllerService>();
    const [controllerStatus, setControllerStatus] = useState<ControllerStatus>(ControllerStatus.DISCONNECTED);

    useEffect(() => {
        controllerService?.addListener((status) => {
            if (status === ControllerStatus.DISCONNECTED) {
                setControllerService(undefined);
            } else if (status === ControllerStatus.CONNECTION_LOST) {
                setControllerStatus(status);
            }
        });
    }, [controllerService])

    return (
        <>
            <Modal show={controllerStatus === ControllerStatus.CONNECTION_LOST} size="sm" scrollable={true} centered={false}>
                <Modal.Body>
                    Lost the connection to the controller
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => { setControllerService(undefined); setControllerStatus(ControllerStatus.DISCONNECTED); }}>
                        <>
                            <FontAwesomeIcon icon={faClose as IconDefinition} />{" "}
                            Close
                        </>
                    </Button>
                </Modal.Footer>
            </Modal>

            <ControllerServiceContext.Provider value={controllerService}>
                <Header />
                <div className="container">
                    {!controllerService && <Connection onConnect={setControllerService} />}
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
                        <Terminal onClose={() => setPage(undefined)}/>
                    )}

                    {controllerService && page === Page.FILEBROWSER && <FileBrowser />}
                </div>
            </ControllerServiceContext.Provider>
        </>
    );
};

export default App;
