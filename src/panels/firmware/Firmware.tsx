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
import { Col, FormCheck } from "react-bootstrap";
import { useLocalStorage } from "../../hooks/useLocalStorage";

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
            {!errorMessage && (
                <>
                    <PageTitle>Install</PageTitle>
                    <p>
                        Select which firmware you want to install on your
                        controller.
                    </p>

                    <select
                        className="form-select form-select-lg mb-3"
                        onChange={(event) => chooseFirmware(event.target.value)}
                    >
                        {!releases?.length && <option>Loading...</option>}
                        {releases.map((release) => (
                            <option key={release.id} value={release.id}>
                                {release.name}
                            </option>
                        ))}
                    </select>
                    <FormCheck
                        type="switch"
                        label="Show pre-releases"
                        checked={Boolean(showPrerelease)}
                        onChange={() => setShowPrerelease((value) => !value)}
                    />
                </>
            )}

            {isLoading && (
                <Col>
                    Fetching <Spinner />
                </Col>
            )}
            {!isLoading && selectedRelease && (
                <>
                    {choice && releaseManifest && !choice.images && (
                        <>
                            <Card className="text-bg-light card">
                                <FirmwareBreadCrumbList
                                    selectedChoices={selectedChoices}
                                    setSelectedChoices={setSelectedChoices}
                                />
                                <Choice choice={choice} onSelect={onSelect} />
                            </Card>
                        </>
                    )}

                    <Markdown>{selectedRelease.body}</Markdown>
                </>
            )}
        </div>
    );
};

export default Firmware;
