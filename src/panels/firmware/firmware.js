import { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { AppContext } from "../../app";
import { Card } from "../../components";
import Button, { ButtonType } from "../../components/button";
import Status from "../../model/status";
import { FirmwareType } from "../../utils";
import * as classes from "./firmware.module.css";

const bluetoothImageUrl = new URL(
  "../../assets/bluetooth.svg",
  import.meta.url
);
const wifiImageUrl = new URL("../../assets/wifi.svg", import.meta.url);

const Firmware = ({ onInstallFirmware, onDisconnect }) => {
  const { status } = useContext(AppContext);
  const [firmwares, setFirmwares] = useState([]);
  const [selectedFirmware, setSelectedFirmware] = useState(null);

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
              (asset) => asset.name.endsWith("-posix.zip").length > 0
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
    <>
      <h2>Select firmware</h2>
      <p>Select which firmware you want to install on your controller.</p>
      <select
        className="form-select form-select-lg mb-3"
        onChange={(event) => chooseFirmware(event.target.value)}
        disabled={status !== Status.CONNECTED}
      >
        {firmwares.map((release) => (
          <option key={release.id} value={release.id}>
            {release.name}
          </option>
        ))}
      </select>

      {selectedFirmware && (
        <>
          <Card className={"text-bg-light " + classes.card}>
            <p>
              Choose this option if you plan to use your controller on a
              wireless network or connecting to it through USB.
            </p>
            <Button
              onClick={() =>
                onInstallFirmware(selectedFirmware, FirmwareType.WIFI)
              }
              loading={status !== Status.CONNECTED}
              disabled={status !== Status.CONNECTED}
            >
              <img src={wifiImageUrl} className={classes.buttonImage} />
              {status !== Status.CONNECTED && "Installing"}
              {status === Status.CONNECTED && "Install with WiFi support"}
            </Button>
          </Card>

          <Card className={"text-bg-light " + classes.card}>
            <p>
              Choose this option if you plan to use your controller through
              Bluetooth or connecting to it through USB.
            </p>

            <Button
              onClick={() =>
                onInstallFirmware(selectedFirmware, FirmwareType.BLUETOOTH)
              }
              loading={status !== Status.CONNECTED}
              disabled={status !== Status.CONNECTED}
            >
              <img src={bluetoothImageUrl} className={classes.buttonImage} />
              {status !== Status.CONNECTED && "Installing"}
              {status === Status.CONNECTED && "Install with Bluetooth support"}
            </Button>
          </Card>

          <ReactMarkdown
            children={selectedFirmware.body}
            className="card-text"
          />
        </>
      )}
    </>
  );
};

export default Firmware;
