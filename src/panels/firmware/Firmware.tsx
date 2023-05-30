import React, { useEffect, useMemo, useState } from "react";
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
                setSelectedChoices(() =>
                manifest?.installable ? [manifest?.installable] : []
            );
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
                                {(selectedChoices.length > 1) && (<><nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        {selectedChoices
                                            .slice(1)
                                            .map((choice) => (
                                                <li className="breadcrumb-item">
                                                    <a
                                                        href="#"
                                                        onClick={() => {
                                                            setSelectedChoices(
                                                                (choices) => [
                                                                    ...choices.splice(
                                                                        0,
                                                                        choices.indexOf(
                                                                            choice
                                                                        ) + 1
                                                                    )
                                                                ]
                                                            );
                                                        }}>
                                                        {choice.name}
                                                    </a>
                                                </li>
                                            ))}
                                    </ol>
                                </nav>
                                <hr /></>)}

                                <h2>{choice["choice-name"]}</h2>
                                <p>{choice.description}</p>

                                <div className="d-grid gap-2">
                                    {choice.choices.map((subChoice) => (
                                        <Button
                                            style={{minHeight: "60px"}}
                                            key={subChoice.name}
                                            onClick={() => {
                                                if (subChoice.images) {
                                                    onInstall(
                                                        selectedRelease,
                                                        releaseManifest!,
                                                        subChoice
                                                    );
                                                } else {
                                                    setSelectedChoices(
                                                        (choices) => [
                                                            ...choices,
                                                            subChoice
                                                        ]
                                                    );
                                                }
                                            }}>
                                            <>
                                                {subChoice.description}
                                                {subChoice.erase && (
                                                    <>
                                                        <br />
                                                        <span className="badge text-bg-danger">
                                                            Will erase files and
                                                            configuration!
                                                        </span>
                                                    </>
                                                )}
                                            </>
                                        </Button>
                                    ))}
                                </div>
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
