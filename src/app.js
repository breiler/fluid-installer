import { createContext, useState } from "react";
import { ESPLoader, Transport } from "esptool-js";
import CryptoJS from "crypto-js";
import Header from "./components/header/header";
import Connection from "./panels/connection/connection";
import Progress from "./panels/progress/progress";
import Done from "./panels/done/done";
import Firmware from "./panels/firmware/firmware";
import Status from "./model/status";

import {
  isSafari,
  convertUint8ArrayToBinaryString,
  fetchAsset,
  unzipAssetData,
  convertToFlashFiles,
  FirmwareType,
} from "./utils";

let espLoaderTerminal = {
  clean() {
    //term.clear();
  },
  writeLine(data) {
    //term.writeln(data);
    console.log(data);
  },
  write(data) {
    //term.write(data)
    console.log(data);
  },
};

export const AppContext = createContext();
const initialProgress = {
  fileIndex: 0,
  fileCount: 1,
  fileName: "",
  fileProgress: 0,
};

const App = () => {
  if (isSafari()) {
    return (
      <h1 align="center">This tool is not supported on Safari browser!</h1>
    );
  }

  const [chip, setChip] = useState(null);
  const [device, setDevice] = useState(null);
  const [transport, setTransport] = useState(null);
  const [espLoader, setEspLoader] = useState(null);
  const [baudRate, setBaudRate] = useState(230400);
  const [status, setStatus] = useState(Status.DISCONNECTED);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(initialProgress);

  const onConnect = async () => {
    setMessage("");
    setStatus(Status.CONNECTING);

    let espTransport = null;
    if (device === null) {
      const serialPortDevice = await navigator.serial.requestPort();
      setDevice(serialPortDevice);
      espTransport = new Transport(serialPortDevice);
      setTransport(espTransport);
    }

    try {
      const loader = new ESPLoader(espTransport, baudRate, espLoaderTerminal);
      setEspLoader(loader);

      const theChip = await loader.main_fn();
      setChip(theChip);
      setStatus(Status.CONNECTED);
    } catch (e) {
      console.error(e);
      setStatus(Status.ERROR);
      setMessage(e.message);
      //term.writeln(`Error: ${e.message}`);
    }

    return Promise.resolve();
  };

  const disconnect = async () => {
    if (transport) await transport.disconnect();
    setDevice(null);
    setTransport(null);
    setEspLoader(null);
    setProgress(initialProgress);
  };

  const onDisconnect = () =>
    disconnect().then(() => setStatus(Status.DISCONNECTED));
  const onDone = () => disconnect().then(() => setStatus(Status.DONE));

  const onErase = async () => {
    try {
      await espLoader.erase_flash();
    } catch (e) {
      console.error(e);
    }
  };

  const flashDevice = async (files) => {
    console.log(files);

    return espLoader.write_flash(
      files,
      "keep",
      undefined,
      undefined,
      false,
      true,
      (fileIndex, written, total) => {
        setProgress({
          fileIndex: fileIndex,
          fileCount: files.length,
          fileName: files[fileIndex].fileName,
          fileProgress: Math.round((written / total) * 100),
        });
        console.log(fileIndex, written, total);
      },
      (image) => {
        return CryptoJS.MD5(CryptoJS.enc.Latin1.parse(image));
      }
    );
  };

  const onInstall = async (firmware, firmwareType = FirmwareType.WIFI) => {
    console.log("Installing " + firmware.name + " with " + firmwareType);
    const asset = firmware.assets.find((asset) =>
      asset.name.endsWith("-posix.zip")
    );

    try {
      setStatus(Status.DOWNLOADING);
      const zipData = await fetchAsset(asset);

      setStatus(Status.EXTRACTING);
      const files = await unzipAssetData(zipData, firmwareType);

      setStatus(Status.FLASHING);
      const flashFiles = convertToFlashFiles(files);
      await flashDevice(flashFiles);
    } catch (error) {
      console.error(error);
      setStatus(Status.ERROR);
    }

    onDone();
  };

  return (
    <>
      <AppContext.Provider
        value={{
          device,
          setDevice,
          baudRate,
          setBaudRate,
          espLoader,
          chip,
          status,
          progress,
        }}
      >
        <Header status={status} />
        <div className="container">
          {(status === Status.DISCONNECTED ||
            status === Status.CONNECTING ||
            status === Status.CONNECTED) && (
            <Connection onConnect={onConnect} />
          )}

          {status === Status.CONNECTED && (
            <Firmware
              onInstallFirmware={onInstall}
              onDisconnect={onDisconnect}
            />
          )}

          {(status === Status.DOWNLOADING ||
            status === Status.EXTRACTING ||
            status === Status.FLASHING) && (
            <Progress progress={progress} status={status} />
          )}

          {status === Status.DONE && <Done onContinue={onDisconnect} />}
          {status === Status.ERROR && <>Bollocks!</>}
        </div>
      </AppContext.Provider>
    </>
  );
};

export default App;
