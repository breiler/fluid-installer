import React, { useState } from "react";
import { Buffer } from "buffer";
import { Button, Spinner } from "../../components";
import { Modal } from "react-bootstrap";
import { faSave, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import Configuration, {
    ConfigurationTab
} from "../../panels/configuration/Configuration";
import ConfigurationTabs from "../../panels/configuration/ConfigurationTabs";
import { ControllerFile } from "../../services/controllerservice";
import CreateFileModal from "../createfilemodal/CreateFileModal";
import { generateNewFileName } from "../../utils/utils";
import { ButtonType } from "../button";

type EditorModalProps = {
    file?: ControllerFile;
    fileData?: Buffer;
    createNew: boolean;
    onClose: () => void;
    onSave: (file: ControllerFile, fileData: Buffer) => Promise<void>;
};

const EditorModal = ({
    file,
    fileData,
    createNew,
    onClose,
    onSave
}: EditorModalProps) => {
    const [value, setValue] = useState<string>(fileData?.toString() || "");
    const [hasErrors, setHasErrors] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [showSaveAs, setShowSaveAs] = useState<boolean>(false);
    const [tab, setTab] = useState<ConfigurationTab>(ConfigurationTab.GENERAL);

    const onSaveAs = (filename: string) => {
        setIsSaving(true);
        setShowSaveAs(false);
        onSave(
            {
                id: "",
                name: filename,
                size: 0
            },
            Buffer.from(value)
        )
            .then(() => onClose())
            .finally(() => {
                setIsSaving(false);
            });
    };

    return (
        <>
            {showSaveAs && (
                <CreateFileModal
                    show={true}
                    defaultFilename={generateNewFileName(
                        file ? [file] : [],
                        file?.name ?? "config.yaml"
                    )}
                    onCreate={(filename) => onSaveAs(filename)}
                    onCancel={() => setShowSaveAs(false)}
                    createNew={false}
                />
            )}
            <Modal show={!!file} size="xl" scrollable={true} centered={false}>
                <Modal.Header
                    style={{
                        paddingBottom: "0px",
                        paddingLeft: "0px",
                        paddingRight: "0px",
                        borderBottomStyle: "none"
                    }}
                >
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
                    {!createNew && (
                        <Button
                            disabled={isSaving}
                            buttonType={ButtonType.WARNING}
                            onClick={() => setShowSaveAs(true)}
                        >
                            <>
                                <FontAwesomeIcon
                                    icon={faSave as IconDefinition}
                                    style={{ marginRight: "8px" }}
                                />{" "}
                                Save as...
                            </>
                        </Button>
                    )}
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
                        }}
                    >
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
        </>
    );
};

export default EditorModal;
