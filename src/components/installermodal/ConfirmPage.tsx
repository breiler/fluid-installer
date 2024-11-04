import React, { useState } from "react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faClose, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Modal } from "react-bootstrap";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import {
    FirmwareChoice,
    GithubRelease,
    GithubReleaseManifest
} from "../../services";
import SelectField from "../fields/SelectField";
import BooleanField from "../fields/BooleanField";

type Props = {
    onCancel: () => void;
    onInstall: (baud: number, files: string[]) => Promise<void>;
    release: GithubRelease;
    manifest: GithubReleaseManifest;
    choice: FirmwareChoice;
};

const ConfirmPage = ({
    release,
    choice,
    manifest,
    onInstall,
    onCancel
}: Props) => {
    const [baud, setBaud] = useLocalStorage("baud", "921600");
    const [files, setFiles] = useState<string[]>([]);

    return (
        <>
            <Modal.Body>
                <h3>Confirm installation</h3>
                <p>
                    This will install the firmware{" "}
                    <strong>{release.name}</strong> to the controller. It will{" "}
                    {!choice.erase && <strong>not</strong>} erase the
                    controller.
                </p>

                <Col lg={8}>
                    {manifest.files && <h5>Extra Options</h5>}
                    {manifest.files &&
                        Object.keys(manifest.files).map((key) => {
                            return (
                                <BooleanField
                                    key={key}
                                    setValue={(value: boolean) => {
                                        if (value) {
                                            setFiles((files) => [
                                                ...files,
                                                key
                                            ]);
                                        } else {
                                            setFiles((files) =>
                                                files.filter((s) => s !== key)
                                            );
                                        }
                                    }}
                                    label={"Install " + key}
                                    value={files.includes(key)}
                                />
                            );
                        })}
                </Col>

                <Col lg={8}>
                    <SelectField
                        label="Installation speed"
                        options={[
                            {
                                name: "921600 baud",
                                value: "921600"
                            },
                            { name: "115200 baud", value: "115200" }
                        ]}
                        value={baud}
                        setValue={(value) => setBaud(value)}
                        helpText="Some controllers need to be installed at a lower speed. If you are experiencing problems you can try and decrease the speed."
                    ></SelectField>
                </Col>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onCancel} variant="secondary">
                    <FontAwesomeIcon icon={faClose as IconDefinition} /> Cancel
                </Button>
                <Button onClick={() => onInstall(+baud, files)}>
                    <FontAwesomeIcon
                        icon={faSave as IconDefinition}
                        style={{ marginRight: "8px" }}
                    />
                    Install
                </Button>
            </Modal.Footer>
        </>
    );
};

export default ConfirmPage;
