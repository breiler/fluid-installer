import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBluetooth } from "@fortawesome/free-brands-svg-icons";
import { faWifi } from "@fortawesome/free-solid-svg-icons";

import { Card } from "../../components";
import Button from "../../components/button";
import { GithubRelease, GithubService } from "../../services/GitHubService";
import "./Firmware.scss";
import { FirmwareType } from "../../services/InstallService";

type Props = {
    onInstall: (
        release: GithubRelease,
        firmwareType: FirmwareType
    ) => void;
};

const Firmware = ({ onInstall}: Props) => {
    const [releases, setReleases] = useState<GithubRelease[]>([]);
    const [selectedRelease, setSelectedRelease] = useState<GithubRelease>();
    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    const chooseFirmware = (id) => {
        const firmware = releases.find((firmware) => firmware.id + "" === id);
        setSelectedRelease(firmware as GithubRelease);
    };

    const fetchReleases = () => {
        GithubService.getReleases()
            .then((releases) => {
                setSelectedRelease(releases?.[0]);
                setReleases(releases);
            })
            .catch((err) => {
                console.error(err);
                setErrorMessage(
                    "Could not download releases, please again later"
                );
            });
    };

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
                    <Card className="text-bg-light card">
                        <p>
                            Choose this option if you plan to use your
                            controller on a wireless network or connecting to it
                            through USB.
                        </p>
                        <Button
                            onClick={() =>
                                onInstall(
                                    selectedRelease,
                                    FirmwareType.WIFI
                                )
                            }>
                            <>
                                <FontAwesomeIcon icon={faWifi} />
                                Install with WiFi support
                            </>
                        </Button>
                    </Card>

                    <Card className="text-bg-light card">
                        <p>
                            Choose this option if you plan to use your
                            controller through Bluetooth or connecting to it
                            through USB.
                        </p>

                        <Button
                            onClick={() =>
                                onInstall(
                                    selectedRelease,
                                    FirmwareType.BLUETOOTH
                                )
                            }>
                            <>
                                <FontAwesomeIcon icon={faBluetooth} />
                                Install with Bluetooth support
                            </>
                        </Button>
                    </Card>

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
