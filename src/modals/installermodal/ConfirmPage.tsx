import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faClose, faFire } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Button, Col, Modal } from "react-bootstrap";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import {
    ControllerFile,
    ControllerStatus,
    FirmwareChoice,
    FirmwareFile,
    GithubRelease,
    GithubReleaseManifest,
    ListFilesCommand
} from "../../services";
import { ControllerServiceContext } from "../../context/ControllerServiceContext";
import SelectField from "../../components/fields/SelectField";
import BooleanField from "../../components/fields/BooleanField";

const LOCALFS_PREFIX = "/localfs/";
const BLOCK_SIZE = 4096; // LittleFS block size on FluidNC
const SPACE_MARGIN = 2 * BLOCK_SIZE; // Metadata overhead

const blocks = (bytes: number) => Math.ceil(bytes / BLOCK_SIZE) * BLOCK_SIZE;
const kb = (bytes: number) => Math.ceil(bytes / 1024) + " KB";

type LocalFsInfo = {
    files: ControllerFile[];
    freeBytes: number;
};

type SpaceShortage = {
    needed: number;
    available: number;
    largestFiles: ControllerFile[];
};

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
    const controllerService = useContext(ControllerServiceContext);
    const [localFs, setLocalFs] = useState<LocalFsInfo | undefined>();
    const [checkingSpace, setCheckingSpace] = useState(false);

    const localFsFiles = files
        .map((key) => manifest.files?.[key] as FirmwareFile)
        .filter((file) => file?.["controller-path"].startsWith(LOCALFS_PREFIX));

    // A fresh install erases the filesystem, so there is nothing to check
    const needsSpaceCheck = !choice.erase && localFsFiles.length > 0;

    // List LocalFS once, the first time a LocalFS file is selected.
    // If the controller can't be listed (not FluidNC, or too old to report
    // free space) the check is skipped rather than blocking the install.
    useEffect(() => {
        if (!needsSpaceCheck || localFs || checkingSpace) {
            return;
        }
        if (controllerService?.status !== ControllerStatus.CONNECTED) {
            return;
        }
        setCheckingSpace(true);
        controllerService
            .send(new ListFilesCommand(), 5000)
            .then((command) => {
                if (command.freeBytes !== undefined) {
                    setLocalFs({
                        files: command.result(),
                        freeBytes: command.freeBytes
                    });
                }
            })
            .catch((error) => console.log("Could not list LocalFS", error))
            .finally(() => setCheckingSpace(false));
    }, [needsSpaceCheck]);

    const getShortage = (): SpaceShortage | undefined => {
        if (!needsSpaceCheck || !localFs) {
            return undefined;
        }
        // Overwriting a file frees its blocks, so they count as available
        const replaced = localFs.files.filter((f) =>
            localFsFiles.some(
                (file) => file["controller-path"] === LOCALFS_PREFIX + f.name
            )
        );
        const available =
            localFs.freeBytes +
            replaced.reduce((sum, f) => sum + blocks(f.size), 0);
        const needed =
            localFsFiles.reduce((sum, file) => sum + blocks(file.size), 0) +
            SPACE_MARGIN;
        if (needed <= available) {
            return undefined;
        }
        return {
            needed,
            available,
            largestFiles: localFs.files
                .filter((f) => !replaced.includes(f))
                .sort((a, b) => b.size - a.size)
                .slice(0, 5)
        };
    };
    const shortage = getShortage();

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

                {shortage && (
                    <Alert variant="danger">
                        {t("modal.installer.insufficient-space", {
                            needed: kb(shortage.needed),
                            available: kb(shortage.available)
                        })}
                        {shortage.largestFiles.length > 0 && (
                            <>
                                <br />
                                {t("modal.installer.largest-files")}
                                <ul className="mb-0">
                                    {shortage.largestFiles.map((f) => (
                                        <li key={f.name}>
                                            {f.name} ({kb(f.size)})
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </Alert>
                )}

                <Col lg={8}>
                    <SelectField
                        label={t("modal.installer.installation-speed")}
                        options={[
                            { name: "921600 baud", value: "921600" },
                            { name: "460800 baud", value: "460800" },
                            { name: "230400 baud", value: "230400" },
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
                <Button
                    onClick={() => onInstall(+baud, files)}
                    disabled={checkingSpace || !!shortage}
                >
                    <FontAwesomeIcon
                        icon={faFire as IconDefinition}
                        style={{ marginRight: "8px" }}
                    />
                    {t("modal.installer.install")}
                </Button>
            </Modal.Footer>
        </>
    );
};

export default ConfirmPage;
