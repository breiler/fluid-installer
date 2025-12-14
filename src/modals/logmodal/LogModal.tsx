import React, { useState } from "react";
import { Button } from "../../components";
import { Modal } from "react-bootstrap";
import { faClose, faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";
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
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (rows && rows.length > 0) {
            try {
                await navigator.clipboard.writeText(rows.join("\n"));
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Failed to copy text: ", err);
            }
        }
    };

    return (
        <Modal show={show} size="lg" centered>
            <Modal.Body>
                <Log onShow={() => {}} show={true} showExpand={false}>
                    {rows?.map(createLogLine)}
                </Log>
            </Modal.Body>

            <Modal.Footer>
                <Button onClick={handleCopy}>
                    <>
                        <FontAwesomeIcon
                            icon={(copied ? faCheck : faCopy) as IconDefinition}
                        />{" "}
                        {copied ? "Copied!" : "Copy"}
                    </>
                </Button>
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
