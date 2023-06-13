import React, { useState } from "react";
import { Buffer } from "buffer";
import { Button, Spinner } from "../../components";
import { Modal } from "react-bootstrap";
import { faSave, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import { File } from "../../services/ControllerService";
import Configuration, {
    ConfigurationTab
} from "../../panels/configuration/Configuration";
import ConfigurationTabs from "../../panels/configuration/ConfigurationTabs";

type EditorModalProps = {
    file?: File;
    fileData?: Buffer;
    onClose: () => void;
    onSave: (file: File, fileData: Buffer) => Promise<void>;
};

const EditorModal = ({ file, fileData, onClose, onSave }: EditorModalProps) => {
    const [value, setValue] = useState<string>(fileData?.toString() || "");
    const [hasErrors, setHasErrors] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [tab, setTab] = useState<ConfigurationTab>(ConfigurationTab.GENERAL);

    return (
        <Modal show={!!file} size="lg" scrollable={true} centered={false}>
            <Modal.Header
                style={{
                    paddingBottom: "0px",
                    paddingLeft: "0px",
                    paddingRight: "0px",
                    borderBottomStyle: "none"
                }}>
                <ConfigurationTabs
                    currentTab={tab}
                    onChange={setTab}
                    style={{ width: "100%" }}
                    hasErrors={hasErrors}
                />
            </Modal.Header>
            <Modal.Body style={{ padding: "0px" }}>
                <Configuration
                    currentTab={tab}
                    value={value}
                    onClose={() => {}}
                    onChange={(value, hasError) => {
                        setValue(value);
                        setHasErrors(hasError ?? false);
                        if (hasError) {
                            setTab(ConfigurationTab.SOURCE);
                        }
                    }}
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
                    disabled={isSaving || hasErrors}
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
                            <FontAwesomeIcon
                                icon={faSave as IconDefinition}
                                style={{ marginRight: "8px" }}
                            />
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
