import React, { useEffect, useMemo, useState } from "react";

import { Card } from "../../components";
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

    const choice = useMemo(
        () => selectedChoices[selectedChoices.length - 1],
        [selectedChoices]
    );
    const chooseFirmware = (id) => {
        const release = releases.find((r) => r.id + "" === id + "");
        setSelectedRelease(release);

        if (release) {
            GithubService.getReleaseManifest(release).then((manifest) => {
                setReleaseManifest(manifest);
                setSelectedChoices([manifest.installable]);
            }).catch(error => {
                setErrorMessage("Could not download the release asset " + error);
            });
        }
    };

    const fetchReleases = () => {
        GithubService.getReleases()
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
        setSelectedChoices((choices) => [...choices, choice]);
        if (choice.images) {
            onInstall(selectedRelease!, releaseManifest!, choice);
        }
    };

    useEffect(() => {
        if (releases && releases.length) {
            chooseFirmware(releases[0].id);
        }
    }, [releases]);

    useEffect(() => fetchReleases(), []);

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
                        onChange={(event) =>
                            chooseFirmware(event.target.value)
                        }>
                        {!releases?.length && <option>Loading...</option>}
                        {releases.map((release) => (
                            <option key={release.id} value={release.id}>
                                {release.name}
                            </option>
                        ))}
                    </select>
                </>
            )}

            {selectedRelease && (
                <>
                    {choice && releaseManifest && !choice.images && (
                        <>
                            <Card className="text-bg-light card">
                                {selectedChoices.length > 1 && (
                                    <>
                                        <nav aria-label="breadcrumb">
                                            <ol className="breadcrumb">
                                                {selectedChoices.map(
                                                    (choice) => (
                                                        <li
                                                            className="breadcrumb-item"
                                                            key={choice.name}>
                                                            <a
                                                                href="#"
                                                                onClick={() => {
                                                                    setSelectedChoices(
                                                                        (
                                                                            choices
                                                                        ) => [
                                                                                ...choices.splice(
                                                                                    0,
                                                                                    choices.indexOf(
                                                                                        choice
                                                                                    ) +
                                                                                    1
                                                                                )
                                                                            ]
                                                                    );
                                                                }}>
                                                                {choice.name}
                                                            </a>
                                                        </li>
                                                    )
                                                )}
                                            </ol>
                                        </nav>
                                        <hr />
                                    </>
                                )}

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
