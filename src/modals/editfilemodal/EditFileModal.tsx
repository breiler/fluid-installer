import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faClose, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { ControllerFile } from "../../services";
import { Button, Spinner } from "../../components";
import Editor from "../../components/editor/Editor";

type EditFileModalProps = {
    file?: ControllerFile;
    fileData?: Buffer;
    onClose: () => void;
    onSave: (file: ControllerFile, fileData: Buffer) => Promise<void>;
};

const EditFileModal = ({
    file,
    fileData,
    onClose,
    onSave
}: EditFileModalProps) => {
    const [value, setValue] = useState<string>(fileData?.toString() || "");
    const [isSaving, setIsSaving] = useState<boolean>(false);

    return (
        <Modal
            show={!!file}
            size="xl"
            scrollable={true}
            centered={false}
            onHide={onClose}
        >
            <Modal.Header closeButton>
                <Modal.Title>Editing {file.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: "0px" }}>
                <Editor value={value} onChange={setValue} format="other" />
            </Modal.Body>
            <Modal.Footer>
                <Button disabled={isSaving} onClick={onClose}>
                    <FontAwesomeIcon icon={faClose as IconDefinition} /> Close
                </Button>
                <Button
                    disabled={isSaving}
                    buttonType={"btn-success"}
                    onClick={() => {
                        setIsSaving(true);
                        onSave(file!, Buffer.from(value))
                            .then(() => onClose())
                            .finally(() => {
                                setIsSaving(false);
                            });
                    }}
                >
                    {!isSaving && (
                        <FontAwesomeIcon
                            icon={faSave as IconDefinition}
                            style={{ marginRight: "8px" }}
                        />
                    )}
                    {isSaving && <Spinner />}
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditFileModal;
