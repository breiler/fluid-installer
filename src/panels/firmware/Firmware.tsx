import React, { useEffect, useMemo, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "../../components";
import {
    FirmwareChoice,
    GithubRelease,
    GithubReleaseManifest,
    GithubService
} from "../../services/GitHubService";
import "./Firmware.scss";
import Choice from "../../components/choice";
import PageTitle from "../../components/pagetitle/PageTitle";
import FirmwareBreadCrumbList from "./FirmwareBreadcrumbList";
import {
    Col,
    FormCheck,
    Row,
    Form,
    DropdownButton,
    Dropdown
} from "react-bootstrap";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faFileArrowUp, faSliders } from "@fortawesome/free-solid-svg-icons";
import UploadCustomImageModal from "../../modals/installermodal/UploadCustomImageModal";
import VersionCard from "../../components/cards/versioncard/VersionCard";
import { ControllerServiceContext } from "../../context/ControllerServiceContext";

type Props = {
    onInstall: (
        release: GithubRelease,
        manifest: GithubReleaseManifest,
        choice: FirmwareChoice
    ) => void;
    githubService: GithubService;
};

const Firmware = ({ onInstall, githubService }: Props) => {
    const { t } = useTranslation();
    const [selectedChoices, setSelectedChoices] = useState<FirmwareChoice[]>(
        []
    );
    const [releases, setReleases] = useState<GithubRelease[]>([]);
    const [uploadCustomImage, setUploadCustomImage] = useState<boolean>(false);
    const [selectedRelease, setSelectedRelease] = useState<GithubRelease>();
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [unsupportedMessage, setUnsupportedMessage] = useState<
        string | undefined
    >();
    const [releaseManifest, setReleaseManifest] = useState<
        GithubReleaseManifest | undefined
    >();
    const [showPrerelease, setShowPrerelease] = useLocalStorage(
        "showPrerelease",
        false
    );
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [mcu, setMcu] = useState<string | undefined>(undefined);

    const controllerService = useContext(ControllerServiceContext);

    const chooseMcu = () => {
        if (mcu && selectedChoices.length == 1) {
            for (mcuentry of selectedChoices[0].choices) {
                if (mcuentry.name === mcu) {
                    setSelectedChoices((choices) => [...choices, mcuentry]);
                    setUnsupportedMessage("");
                    return;
                }
            }
            setUnsupportedMessage("This release does not support " + mcu);
        }
    };

    const choice = useMemo(() => {
        chooseMcu();
        return selectedChoices[selectedChoices.length - 1];
    }, [selectedChoices]);
    const chooseFirmware = (id) => {
        const release = releases.find((r) => r.id + "" === id + "");
        setSelectedRelease(release);

        if (release) {
            setIsLoading(true);
            githubService
                .getReleaseManifest(release)
                .then((manifest) => {
                    setReleaseManifest(manifest);
                    setSelectedChoices([manifest.installable]);
                })
                .catch((error) => {
                    setErrorMessage(
                        "Could not download the release asset " + error
                    );
                })
                .finally(() => setIsLoading(false));
        }
    };

    const fetchReleases = () => {
        githubService
            .getReleases(showPrerelease === "true")
            .then((releases) => {
                setReleases(releases);
            })
            .catch((error) => {
                console.error(error);
                setErrorMessage(
                    "Could not download releases, please try again later"
                );
            });
    };

    const onSelect = (choice: FirmwareChoice) => {
        if (choice.images) {
            onInstall(selectedRelease!, releaseManifest!, choice);
        } else {
            setSelectedChoices((choices) => [...choices, choice]);
        }
    };

    // The key is the MCU name returned by esploader.
    // The value is the corresponding name in FluidNC manifests
    const mcuMap = new Map<string, string>([
        ["ESP32-S3", "esp32s3"],
        ["ESP32", "esp32"]
    ]);

    useEffect(() => {
        const getMcu = async (): string => {
            await controllerService.serialPort
                .getInfo()
                .then((result) => {
                    setMcu(mcuMap.get(result.mcu));
                })
                .catch((error) => {
                    console.log("Cannot get MCU:" + error);
                    setErrorMessage("Could not determine the MCU type");
                    setMcu(undefined);
                });
        };
        if (mcu === undefined) {
            getMcu();
        }
    }, []);

    useEffect(() => {
        chooseMcu();
    }, [mcu]);

    useEffect(() => {
        if (releases && releases.length) {
            chooseFirmware(releases[0].id);
        }
    }, [releases]);

    useEffect(() => fetchReleases(), [showPrerelease]);

    return (
        <div className="firmware-component">
            {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
            )}

            {uploadCustomImage && (
                <UploadCustomImageModal
                    onClose={() => setUploadCustomImage(false)}
                />
            )}

            {!errorMessage && !mcu && (
                <PageTitle>{"Getting MCU Type ..."}</PageTitle>
            )}

            {!errorMessage && mcu && (
                <>
                    <PageTitle>
                        {t("panel.firmware.install") + " on " + mcu}
                    </PageTitle>
                    <p>{t("panel.firmware.install-description")}</p>

                    <Row>
                        <Col sm="12" md="12" lg="9" xl="8">
                            <Row>
                                <Col>
                                    <Form.Select
                                        size="lg"
                                        onChange={(event) =>
                                            chooseFirmware(event.target.value)
                                        }
                                    >
                                        {!releases?.length && (
                                            <option>
                                                {t("panel.firmware.loading")}
                                            </option>
                                        )}
                                        {releases.map((release) => (
                                            <option
                                                key={release.id}
                                                value={release.id}
                                            >
                                                {release.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col
                                    xs="3"
                                    sm="3"
                                    md="2"
                                    lg="2"
                                    style={{ paddingLeft: 0 }}
                                >
                                    <DropdownButton
                                        variant="outline"
                                        className={"d-grid"}
                                        size="lg"
                                        title={
                                            <FontAwesomeIcon
                                                icon={
                                                    faSliders as IconDefinition
                                                }
                                            />
                                        }
                                    >
                                        <Dropdown.Item
                                            onClick={() =>
                                                setShowPrerelease(
                                                    (
                                                        showPrerelease !==
                                                        "true"
                                                    ).toString()
                                                )
                                            }
                                        >
                                            {" "}
                                            <FormCheck
                                                type="switch"
                                                label={t(
                                                    "panel.firmware.show-prereleases"
                                                )}
                                                checked={
                                                    showPrerelease === "true"
                                                }
                                            />
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item
                                            onClick={() =>
                                                setUploadCustomImage(true)
                                            }
                                        >
                                            <FontAwesomeIcon
                                                icon={
                                                    faFileArrowUp as IconDefinition
                                                }
                                            />
                                            {t(
                                                "panel.firmware.install-custom-image"
                                            )}
                                        </Dropdown.Item>
                                    </DropdownButton>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </>
            )}

            {isLoading && (
                <Row style={{ marginTop: "40px" }}>
                    <Col sm="12" md="12" lg="9" xl="8">
                        {t("panel.firmware.fetching")} <Spinner />
                    </Col>
                </Row>
            )}
            {!isLoading && mcu && selectedRelease && (
                <div>
                    <Row>
                        <Col
                            sm="12"
                            md="12"
                            lg="9"
                            xl="8"
                            style={{ marginTop: "40px" }}
                        >
                            <FirmwareBreadCrumbList
                                release={selectedRelease}
                                selectedChoices={selectedChoices}
                                setSelectedChoices={setSelectedChoices}
                            />
                            <hr />
                            {unsupportedMessage && (
                                <div className="alert alert-danger">
                                    {unsupportedMessage}
                                </div>
                            )}
                            {!unsupportedMessage &&
                                choice &&
                                releaseManifest &&
                                !choice.images && (
                                    <div>
                                        <Choice
                                            choice={choice}
                                            onSelect={onSelect}
                                        />
                                    </div>
                                )}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="12" md="12" lg="9" xl="8">
                            <VersionCard
                                release={selectedRelease}
                                isLatest={false}
                            />
                        </Col>
                    </Row>
                </div>
            )}
        </div>
    );
};

export default Firmware;
