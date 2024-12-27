import React, { useEffect, useMemo, useState } from "react";

import { Card, Spinner } from "../../components";
import {
    FirmwareChoice,
    GithubRelease,
    GithubReleaseManifest,
    GithubService
} from "../../services/GitHubService";
import "./Firmware.scss";
import Choice from "../../components/choice";
import { Markdown } from "../../components/markdown/Markdown";
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
import UploadCustomImageModal from "../../components/installermodal/UploadCustomImageModal";

type Props = {
    onInstall: (
        release: GithubRelease,
        manifest: GithubReleaseManifest,
        choice: FirmwareChoice
    ) => void;
};

const Firmware = ({ onInstall }: Props) => {
    const [selectedChoices, setSelectedChoices] = useState<FirmwareChoice[]>(
        []
    );
    const [releases, setReleases] = useState<GithubRelease[]>([]);
    const [uploadCustomImage, setUploadCustomImage] = useState<boolean>(false);
    const [selectedRelease, setSelectedRelease] = useState<GithubRelease>();
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [releaseManifest, setReleaseManifest] = useState<
        GithubReleaseManifest | undefined
    >();
    const [showPrerelease, setShowPrerelease] = useLocalStorage(
        "showPrerelease",
        false
    );
    const [isLoading, setLoading] = useState<boolean>(false);

    const choice = useMemo(
        () => selectedChoices[selectedChoices.length - 1],
        [selectedChoices]
    );
    const chooseFirmware = (id) => {
        const release = releases.find((r) => r.id + "" === id + "");
        setSelectedRelease(release);

        if (release) {
            setLoading(true);
            GithubService.getReleaseManifest(release)
                .then((manifest) => {
                    setReleaseManifest(manifest);
                    setSelectedChoices([manifest.installable]);
                })
                .catch((error) => {
                    setErrorMessage(
                        "Could not download the release asset " + error
                    );
                })
                .finally(() => setLoading(false));
        }
    };

    const fetchReleases = () => {
        GithubService.getReleases(Boolean(showPrerelease))
            .then((releases) => {
                setReleases(releases);
            })
            .catch((err) => {
                console.error(err);
                setErrorMessage(
                    "Could not download releases, please again later"
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

            {!errorMessage && (
                <>
                    <PageTitle>Install</PageTitle>
                    <p>
                        Select which firmware you want to install on your
                        controller.
                    </p>

                    <Row>
                        <Col>
                            <Form.Select
                                size="lg"
                                onChange={(event) =>
                                    chooseFirmware(event.target.value)
                                }
                            >
                                {!releases?.length && (
                                    <option>Loading...</option>
                                )}
                                {releases.map((release) => (
                                    <option key={release.id} value={release.id}>
                                        {release.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col sm="4" md="3" lg="2">
                            <DropdownButton
                                className={"d-grid"}
                                size="lg"
                                title={
                                    <FontAwesomeIcon
                                        icon={faSliders as IconDefinition}
                                    />
                                }
                            >
                                <Dropdown.Item>
                                    {" "}
                                    <FormCheck
                                        type="switch"
                                        label="Show pre-releases"
                                        checked={showPrerelease === "true"}
                                        onChange={(event) => {
                                            setShowPrerelease(
                                                Boolean(
                                                    event.target.checked
                                                ).toString()
                                            );
                                        }}
                                    />
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item
                                    onClick={() => setUploadCustomImage(true)}
                                >
                                    <FontAwesomeIcon
                                        icon={faFileArrowUp as IconDefinition}
                                    />
                                    Upload custom image...
                                </Dropdown.Item>
                            </DropdownButton>
                        </Col>
                    </Row>
                </>
            )}

            {isLoading && (
                <Col>
                    Fetching <Spinner />
                </Col>
            )}
            {!isLoading && selectedRelease && (
                <>
                    <Row>
                        <Col sm="12" md="12" lg="6">
                            {choice && releaseManifest && !choice.images && (
                                <Card>
                                    <FirmwareBreadCrumbList
                                        selectedChoices={selectedChoices}
                                        setSelectedChoices={setSelectedChoices}
                                    />
                                    <Choice
                                        choice={choice}
                                        onSelect={onSelect}
                                    />
                                </Card>
                            )}
                        </Col>

                        <Col sm="12" md="12" lg="6">
                            <Card>
                                <Markdown>{selectedRelease.body}</Markdown>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
};

export default Firmware;
