import React, { useState } from "react";
import { Buffer } from "buffer";
import { Button, Spinner } from "../../components";
import { Modal } from "react-bootstrap";
import {
    faSave,
    faClose
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import CodeMirror from "@uiw/react-codemirror";

import { File } from "../../services/ControllerService";

type EditorModalProps = {
    file?: File;
    fileData?: Buffer;
    onClose: () => void;
    onSave: (file: File, fileData: Buffer) => Promise<void>;
};

const EditorModal = ({ file, fileData, onClose, onSave }: EditorModalProps) => {
    const [value, setValue] = useState<string>(fileData?.toString() || "");
    const [isSaving, setIsSaving] = useState<boolean>(false);

    return (
        <Modal show={!!file} size="lg" centered>
            <Modal.Header>
                <h2>{file?.name}</h2>
            </Modal.Header>
            <Modal.Body>
                <CodeMirror
                    readOnly={isSaving}
                    value={fileData?.toString()}
                    maxHeight="600px"
                    onChange={(value) => setValue(value)}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button disabled={isSaving} onClick={onClose}>
                    <>
                        <FontAwesomeIcon icon={faClose as IconDefinition} />{" "}
                        Close
                    </>
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
                    }}>
                    <>
                        {!isSaving && (
                            <FontAwesomeIcon icon={faSave as IconDefinition} style={{marginRight: "8px"}}/>
                        )}
                        {isSaving && <Spinner />}
                        Save
                    </>
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditorModal;
