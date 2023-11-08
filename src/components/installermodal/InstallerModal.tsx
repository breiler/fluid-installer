import React from "react";
import { Button, Spinner } from "../../components";
import { Modal } from "react-bootstrap";
import { InstallerState } from "../../services";
import { Done, Progress } from "../../panels";
import { FlashProgress } from "../../services/FlashService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import PageTitle from "../pagetitle/PageTitle";
import BootloaderInfo from "../../panels/bootloaderinfo/BootloaderInfo";

type InstallerModalProps = {
    state: InstallerState;
    progress: FlashProgress;
    errorMessage: string | undefined;
    onClose: () => void;
};

const InstallerModal = ({
    state,
    progress,
    errorMessage,
    onClose
}: InstallerModalProps) => {
    return (
        <Modal centered show={true}>
            <Modal.Body>
                {(state === InstallerState.DOWNLOADING ||
                    state === InstallerState.CHECKING_SIGNATURES) && (
                    <>
                        <PageTitle>Downloading</PageTitle>
                        <p>
                            Downloading package... <Spinner />
                        </p>
                    </>
                )}
                {state === InstallerState.ENTER_FLASH_MODE && (
                    <BootloaderInfo />
                )}
                {state === InstallerState.FLASHING && (
                    <Progress progress={progress} status={state} />
                )}
                {state === InstallerState.RESTARTING && (
                    <>
                        <PageTitle>Restarting</PageTitle>
                        <p>
                            Waiting for controller restart... <Spinner />
                        </p>
                    </>
                )}
                {state === InstallerState.DONE && <Done onContinue={onClose} />}
                {state === InstallerState.ERROR && (
                    <>
                        <div className="alert alert-danger">
                            <FontAwesomeIcon icon={faBan as IconDefinition} />{" "}
                            {errorMessage}
                        </div>
                        <Button onClick={onClose}>
                            <>Close</>
                        </Button>
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default InstallerModal;
