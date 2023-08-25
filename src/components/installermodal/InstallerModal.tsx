import React from "react";
import { Spinner } from "../../components";
import { Modal } from "react-bootstrap";
import { InstallerState } from "../../services";
import { Done, Progress } from "../../panels";
import { FlashProgress } from "../../services/FlashService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faBan } from "@fortawesome/free-solid-svg-icons";

type InstallerModalProps = {
    state: InstallerState,
    progress: FlashProgress,
    errorMessage: string|undefined,
    onClose: () => void
};

const InstallerModal = ({ state, progress, errorMessage, onClose }: InstallerModalProps) => {

    return (
        <Modal centered show={true}>
            <Modal.Body>
            {(state === InstallerState.DOWNLOADING ||
                state === InstallerState.CHECKING_SIGNATURES ||
                state === InstallerState.FLASHING ||
                state === InstallerState.FLASH_DONE) && (
                    <Progress progress={progress} status={state} />
                )}

            {state === InstallerState.DONE && <Done onContinue={onClose} />}
            {state === InstallerState.ERROR && (
                <div className="alert alert-danger"><FontAwesomeIcon icon={faBan as IconDefinition}/> {errorMessage}</div>
            )}

            </Modal.Body>
        </Modal>
    );
};

export default InstallerModal;
