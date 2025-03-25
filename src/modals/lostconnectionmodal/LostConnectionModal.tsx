import React, { useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { ControllerStatus } from "../../services";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPlugCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { ControllerServiceContext } from "../../context/ControllerServiceContext";
import { useTranslation } from "react-i18next";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type LostConnectionModalProps = {
    onClose: () => void;
};

const LostConnectionModal = ({ onClose }: LostConnectionModalProps) => {
    const { t } = useTranslation();
    const controllerService = useContext(ControllerServiceContext);
    const [controllerStatus, setControllerStatus] = useState<ControllerStatus>(
        ControllerStatus.DISCONNECTED
    );

    useEffect(() => {
        const listener = (status) => {
            if (status === ControllerStatus.CONNECTION_LOST) {
                setControllerStatus(status);
            }
        };

        controllerService?.addListener(listener);

        () => controllerService?.removeListener(listener);
    }, [controllerService]);

    return (
        <Modal
            show={controllerStatus === ControllerStatus.CONNECTION_LOST}
            size="sm"
            scrollable={true}
            centered={true}
        >
            <Modal.Body>
                <div
                    className="d-flex justify-content-center text-danger"
                    style={{ marginBottom: 16 }}
                >
                    <FontAwesomeIcon
                        icon={faPlugCircleXmark as IconDefinition}
                        size="4x"
                    />
                </div>

                <p>{t("modal.lost-connection.description")}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={() => {
                        setControllerStatus(undefined);
                        onClose();
                    }}
                >
                    <FontAwesomeIcon icon={faClose as IconDefinition} />{" "}
                    {t("modal.lost-connection.close")}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default LostConnectionModal;
