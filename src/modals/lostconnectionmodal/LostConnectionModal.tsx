import React, { useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { ControllerStatus } from "../../services";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPlugCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import useControllerStatus from "../../hooks/useControllerStatus";
import { ControllerServiceContext } from "../../context/ControllerServiceContext";

type LostConnectionModalProps = {
    onClose: () => void;
};

const LostConnectionModal = ({ onClose }: LostConnectionModalProps) => {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const controllerService = useContext(ControllerServiceContext);
    const controllerStatus = useControllerStatus(controllerService);

    useEffect(() => {
        if (controllerStatus === ControllerStatus.CONNECTION_LOST) {
            setShowModal(true);
        }
    }, [controllerStatus]);

    return (
        <Modal show={showModal} size="sm" scrollable={true} centered={true}>
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
                        onClose();
                        setShowModal(false);
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
