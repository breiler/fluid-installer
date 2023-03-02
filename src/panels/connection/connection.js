import { useContext, useState } from "react";
import { AppContext } from "../../app";
import { Button } from "../../components";
import Status from "../../model/status";
import * as classes from "./connection.module.css";

const connectImageUrl = new URL("../../assets/connect.svg", import.meta.url);

const Connection = ({ onConnect }) => {
  const { baudRate, setBaudRate, status } = useContext(AppContext);
  const { showAdvanced, setShowAdvanced } = useState(false);

  return (
    <>
      {(status === Status.DISCONNECTED || status === Status.CONNECTING) && (
        <>
          <h2>FluidNC Web Installer</h2>
          <p>
            This tool will make it easy to install or upgrade FluidNC on your
            controller. Plug in your controller and press Connect to continue.
          </p>

          <div className="mx-auto" style={{ textAlign: "center" }}>
            <img
              className={classes.image}
              src={connectImageUrl}
              alt="Connect"
            />
          </div>
        </>
      )}

      {status !== Status.CONNECTED && showAdvanced && (
        <div>
          <label className="col-sm-2 col-form-label">Baudrate:</label>
          <select
            className="form-select"
            value={baudRate}
            onChange={(event) => setBaudRate(event.value)}
          >
            <option value="921600">921600</option>
            <option value="460800">460800</option>
            <option value="230400">230400</option>
            <option value="115200">115200</option>
          </select>
        </div>
      )}

      {status !== Status.CONNECTED && (
        <div className="mx-auto" style={{ textAlign: "center" }}>
          <Button
            style={{ width: "460px", marginRight: "0px" }}
            onClick={onConnect}
            disabled={status === Status.CONNECTING}
            loading={status === Status.CONNECTING}
          >
            {status === Status.CONNECTING && "Connecting"}
            {status === Status.DISCONNECTED && "Connect"}
          </Button>
        </div>
      )}
    </>
  );
};
export default Connection;
