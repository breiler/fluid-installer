import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBluetooth } from "@fortawesome/free-brands-svg-icons";
import { faWifi } from "@fortawesome/free-solid-svg-icons";

import { Card } from "../../components";
import Button from "../../components/button";
import {
    FirmwareChoice,
    GithubRelease,
    GithubReleaseManifest,
    GithubService
} from "../../services/GitHubService";
import "./Firmware.scss";
import { FirmwareType } from "../../services/InstallService";

type Props = {
    onInstall: (
        release: GithubRelease,
        manifest: GithubReleaseManifest,
        choice: FirmwareChoice
    ) => void;
};

const Firmware = ({ onInstall }: Props) => {
    const [releases, setReleases] = useState<GithubRelease[]>([]);
    const [selectedRelease, setSelectedRelease] = useState<GithubRelease>();
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [releaseManifest, setReleaseManifest] = useState<
        GithubReleaseManifest | undefined
    >();

    const [choice, setChoice] = useState<FirmwareChoice | undefined>();

    const chooseFirmware = (id) => {
        const release = releases.find((r) => r.id + "" === id + "");
        setChoice(undefined);
        setSelectedRelease(release);
        if (release) {
            GithubService.getReleaseManifest(release).then((manifest) => {
                setReleaseManifest(manifest);
                setChoice(manifest.installable);
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

    useEffect(() => {
        if (releases && releases.length) {
            console.log(releases[0].id);
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
                    <h2>Select firmware</h2>
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
                    {choice && !choice.images && (
                        <>
                            <Card className="text-bg-light card">
                                <h2>{choice["choice-name"]}</h2>
                                <p>{choice.description}</p>

                                <>
                                    {choice.choices.map((subChoice) => (
                                        <Button
                                            key={subChoice.name}
                                            onClick={() => {
                                                if (subChoice.images) {
                                                    onInstall(
                                                        selectedRelease,
                                                        releaseManifest!,
                                                        subChoice
                                                    );
                                                } else {
                                                    setChoice(subChoice);
                                                }
                                            }}>
                                            <>{subChoice.description}</>
                                        </Button>
                                    ))}
                                </>
                            </Card>
                        </>
                    )}

                    <ReactMarkdown
                        children={selectedRelease.body}
                        className="card-text"
                    />
                </>
            )}
        </div>
    );
};

export default Firmware;
