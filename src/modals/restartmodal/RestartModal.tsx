import React, { useContext, useEffect, useState } from "react";
import { Button, Spinner } from "../../components";
import { Modal } from "react-bootstrap";
import { ControllerServiceContext } from "../../context/ControllerServiceContext";
import { ControllerStatus } from "../../services";
import "./RestartModal.scss";
import { faCheck, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import ControllerLog from "../../components/controllerlog/ControllerLog";

type RestartModalProps = {
    show?: boolean;
    text?: string;
};

const RestartModal = ({ show }: RestartModalProps) => {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [showLog, setShowLog] = useState<boolean>(false);
    const controllerService = useContext(ControllerServiceContext);

    useEffect(() => {
        const listener = (status) => {
            if (status === ControllerStatus.CONNECTED) {
                setIsConnected(true);
            } else {
                setIsConnected(false);
            }
        };
        controllerService?.addListener(listener);
        return () => controllerService.removeListener(listener);
    }, [controllerService]);

    return (
        <Modal
            show={show || showLog}
            size="lg"
            centered
            className="restart-modal"
        >
            <Modal.Body>
                {!isConnected && (
                    <div className="title">
                        Restarting controller... <Spinner />
                    </div>
                )}

                {isConnected && !showLog && (
                    <div className="title">
                        Connected to the controller{" "}
                        <span className="success">
                            <FontAwesomeIcon icon={faCheck as IconDefinition} />
                        </span>
                    </div>
                )}

                <ControllerLog
                    show={showLog}
                    onShow={setShowLog}
                    onError={() => setShowLog(true)}
                    controllerService={controllerService}
                />
            </Modal.Body>
            {isConnected && (
                <Modal.Footer>
                    <Button onClick={() => setShowLog(false)}>
                        <>
                            <FontAwesomeIcon icon={faClose as IconDefinition} />{" "}
                            Close
                        </>
                    </Button>
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default RestartModal;
