import React, { useState } from "react";
import {
    Form,
    InputGroup,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
} from "react-bootstrap";
import Button from "../button";

type Props = {
    show: boolean;
    defaultFilename: string;
    onCreate: (filename: string) => void;
    onCancel: () => void;
};

const CreateFileModal = ({
    show,
    defaultFilename,
    onCancel,
    onCreate
}: Props) => {
    const [filename, setFileName] = useState(defaultFilename);

    return (
        <Modal show={show} size="sm" scrollable={true} centered={true}>
            <ModalHeader>Create new config file</ModalHeader>
            <ModalBody>
                <InputGroup hasValidation>
                    <Form.Control
                        type={"text"}
                        placeholder={"Filename"}
                        value={filename}
                        onChange={(event) => setFileName(event.target.value)}
                    />
                </InputGroup>
            </ModalBody>
            <ModalFooter>
                <Button onClick={onCancel}>Cancel</Button>
                <Button
                    buttonType="btn-success"
                    onClick={() => onCreate(filename)}
                >
                    OK
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default CreateFileModal;
