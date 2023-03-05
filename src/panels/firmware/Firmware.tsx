import React from "react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Card } from "../../components";
import Button from "../../components/button";
import Status from "../../model/Status";
import { InstallerState } from "../../pages/installer/Installer";
import { FirmwareType } from "../../utils/utils";
import "./firmware.scss";

const bluetoothImageUrl = new URL(
    "../../assets/bluetooth.svg",
    import.meta.url
);
const wifiImageUrl = new URL("../../assets/wifi.svg", import.meta.url);

type Props = {
    onInstallFirmware: (firmware: any, firmwareType: FirmwareType) => void;
};

const Firmware = ({ onInstallFirmware }: Props) => {
    const [firmwares, setFirmwares] = useState<any[]>([]);
    const [selectedFirmware, setSelectedFirmware] = useState<any>(null);

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
                throw err;
            });
    }, [setFirmwares, setSelectedFirmware]);

    return (
        <div className="firmware-component">
            <h2>Select firmware</h2>
            <p>Select which firmware you want to install on your controller.</p>
            <select
                className="form-select form-select-lg mb-3"
                onChange={(event) => chooseFirmware(event.target.value)}>
                {firmwares.map((release) => (
                    <option key={release.id} value={release.id}>
                        {release.name}
                    </option>
                ))}
            </select>

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
                                <img
                                    src={wifiImageUrl.toString()}
                                    className="button-image"
                                />
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
                                <img
                                    src={bluetoothImageUrl.toString()}
                                    className="button-image"
                                />
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
