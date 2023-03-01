import { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { AppContext, Status } from "../../app";
import * as classes from "./firmware.module.css";

const Firmware = ({ onInstallFirmware, onDisconnect }) => {
  const { status } = useContext(AppContext);
  const [firmwares, setFirmwares] = useState([]);
  const [selectedFirmware, setSelectedFirmware] = useState(null);

  const chooseFirmware = (id) => {
    const firmware = firmwares.find((firmware) => firmware.id + "" === id);
    setSelectedFirmware(firmware);
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
        <div className="card">
          <div className="card-body">
            <ReactMarkdown
              children={selectedFirmware.body}
              className="card-text"
            />
          </div>

          <div className="card-footer">
            <button
              className={classes.button + " btn btn-danger btn-lg"}
              type="button"
              onClick={onDisconnect}
              disabled={status !== Status.CONNECTED}
            >
              Disconnect
            </button>

            <button
              type="button"
              className={classes.button + " btn btn-primary btn-lg"}
              onClick={() => onInstallFirmware(selectedFirmware)}
              disabled={status !== Status.CONNECTED}
            >
              {status !== Status.CONNECTED && (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                  Installing
                </>
              )}
              {status === Status.CONNECTED && "Install"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Firmware;
