import React from "react";
import { Button } from "../../components";
import { Modal } from "react-bootstrap";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import Log from "../../components/log/Log";
import { createLogLine } from "../../utils/logutils";

type RestartModalProps = {
    show?: boolean;
    setShow: (show: boolean) => void;
    rows?: string[];
};

const LogModal = ({ show, setShow, rows }: RestartModalProps) => {
    return (
        <Modal show={show} size="lg" centered>
            <Modal.Body>
                <Log onShow={() => {}} show={true} showExpand={false}>
                    {rows?.map(createLogLine)}
                </Log>
            </Modal.Body>

            <Modal.Footer>
                <Button onClick={() => setShow(false)}>
                    <>
                        <FontAwesomeIcon icon={faClose as IconDefinition} />{" "}
                        Close
                    </>
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default LogModal;
