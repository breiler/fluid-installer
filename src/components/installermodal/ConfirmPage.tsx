import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faClose, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Modal } from "react-bootstrap";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import {
    FirmwareChoice,
    FirmwareFile,
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
    const { t } = useTranslation();

    return (
        <>
            <Modal.Body>
                <h3>{t("modal.installer.confirm-installation")}</h3>
                <p>
                    {t("modal.installer.confirm-installation-description", {
                        release: release.name,
                        not: !choice.erase ? t("modal.installer.not") : ""
                    })}
                </p>

                <Col lg={8}>
                    {manifest.files && <h5>Extra Options</h5>}
                    {manifest.files &&
                        Object.keys(manifest.files).map((key) => {
                            return (
                                <BooleanField
                                    key={key}
                                    setValue={(value: boolean) => {
                                        // Attempt to get the already selected files with the same path
                                        const selectedFile =
                                            manifest.files?.[key];
                                        const previouslySelectedFile =
                                            Array.from(manifest.files ?? [])
                                                .filter(
                                                    ([, file]) =>
                                                        (
                                                            file as FirmwareFile
                                                        )?.[
                                                            "controller-path"
                                                        ] ===
                                                        selectedFile?.[
                                                            "controller-path"
                                                        ]
                                                )
                                                .map((object) => object[0]);

                                        if (value) {
                                            setFiles((files) => [
                                                ...files.filter(
                                                    (fileKey) =>
                                                        previouslySelectedFile.indexOf(
                                                            fileKey
                                                        ) !== -1
                                                ), // Untoggles the files with the same destination path
                                                key
                                            ]);
                                        } else {
                                            setFiles((files) =>
                                                files.filter((s) => s !== key)
                                            );
                                        }
                                    }}
                                    label={
                                        t("modal.installer.install") + " " + key
                                    }
                                    value={files.includes(key)}
                                />
                            );
                        })}
                </Col>

                <Col lg={8}>
                    <SelectField
                        label={t("modal.installer.installation-speed")}
                        options={[
                            {
                                name: "921600 baud",
                                value: "921600"
                            },
                            { name: "115200 baud", value: "115200" }
                        ]}
                        value={baud}
                        setValue={(value) => setBaud(value)}
                        helpText={t("modal.installer.installation-speed-help")}
                    ></SelectField>
                </Col>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onCancel} variant="secondary">
                    <FontAwesomeIcon icon={faClose as IconDefinition} />{" "}
                    {t("modal.installer.cancel")}
                </Button>
                <Button onClick={() => onInstall(+baud, files)}>
                    <FontAwesomeIcon
                        icon={faSave as IconDefinition}
                        style={{ marginRight: "8px" }}
                    />
                    {t("modal.installer.install")}
                </Button>
            </Modal.Footer>
        </>
    );
};

export default ConfirmPage;
