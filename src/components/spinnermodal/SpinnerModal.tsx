import React from "react";
import { Spinner } from "../../components";
import { Modal } from "react-bootstrap";

type SpinnerModalProps = {
    show?: boolean;
    text?: string;
};

const SpinnerModal = ({ show, text }: SpinnerModalProps) => {
    return (
        <Modal show={show} centered>
            <Modal.Body>
                {text} <Spinner />
            </Modal.Body>
        </Modal>
    );
};

export default SpinnerModal;
