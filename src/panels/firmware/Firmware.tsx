import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBluetooth } from "@fortawesome/free-brands-svg-icons";
import { faWifi } from "@fortawesome/free-solid-svg-icons";

import { Card } from "../../components";
import Button from "../../components/button";
import { FirmwareType } from "../../utils/utils";
import "./Firmware.scss";

type Props = {
    onInstallFirmware: (firmware: any, firmwareType: FirmwareType) => void;
};

const Firmware = ({ onInstallFirmware }: Props) => {
    const [firmwares, setFirmwares] = useState<any[]>([]);
    const [selectedFirmware, setSelectedFirmware] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    const chooseFirmware = (id) => {
        const firmware = firmwares.find((firmware) => firmware.id + "" === id);
        setSelectedFirmware(firmware);
        console.log(firmware);
    };

    useEffect(() => {
        fetch("https://api.github.com/repos/bdring/FluidNC/releases")
            .then((res) => res.json())
            .then((releases) => {
                const availableReleases = releases
                    .filter((release) => !release.draft && !release.prerelease)
                    .filter((release) =>
                        release.assets.filter(
                            (asset) =>
                                asset.name.endsWith("-posix.zip").length > 0
                        )
                    )
                    .sort((release1, release2) => release1.id > release2.id);

                setSelectedFirmware(availableReleases?.[0]);
                setFirmwares(availableReleases);
            })
            .catch((err) => {
                console.error(err);
                setErrorMessage("Could not download releases");
            });
    }, [setFirmwares, setSelectedFirmware, setErrorMessage]);

    return (
        <div className="firmware-component">
            <h2>Select firmware</h2>
            <p>Select which firmware you want to install on your controller.</p>

            {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
            )}
            {!errorMessage && (
                <select
                    className="form-select form-select-lg mb-3"
                    onChange={(event) => chooseFirmware(event.target.value)}>
                    {!firmwares?.length && <option>Loading...</option>}
                    {firmwares.map((release) => (
                        <option key={release.id} value={release.id}>
                            {release.name}
                        </option>
                    ))}
                </select>
            )}

            {selectedFirmware && (
                <>
                    <Card className="text-bg-light card">
                        <p>
                            Choose this option if you plan to use your
                            controller on a wireless network or connecting to it
                            through USB.
                        </p>
                        <Button
                            onClick={() =>
                                onInstallFirmware(
                                    selectedFirmware,
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
                                onInstallFirmware(
                                    selectedFirmware,
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
                        children={selectedFirmware.body}
                        className="card-text"
                    />
                </>
            )}
        </div>
    );
};

export default Firmware;
