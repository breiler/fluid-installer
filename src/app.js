import { createContext, useState } from "react";
import { ESPLoader, Transport } from "esptool-js";
import JSZip from "jszip";
import CryptoJS from "crypto-js";
import Header from "./components/header/header";
import Connection from "./panels/connection/connection";
import Progress from "./panels/progress/progress";
import Done from "./panels/done/done";
import Firmware from "./panels/firmware/firmware";
import Status from "./model/status";

import { isSafari, convertUint8ArrayToBinaryString } from "./utils";

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

const findFileInZip = (zip, fileName) => {
  return Object.values(zip.files).find((file) => file.name.endsWith(fileName));
};

export const AppContext = createContext();

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
  const [progress, setProgress] = useState({
    fileIndex: 2,
    fileCount: 4,
    fileName: "Firmware",
    fileProgress: 50,
  });

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

  const onDisconnect = async () => {
    if (transport) await transport.disconnect();

    setDevice(null);
    setTransport(null);
    setEspLoader(null);
    setStatus(Status.DISCONNECTED);
  };

  const onErase = async () => {
    try {
      await espLoader.erase_flash();
    } catch (e) {
      console.error(e);
      //term.writeln(`Error: ${e.message}`);
    }
  };

  const onInstall = (firmware) => {
    console.log(firmware);

    const asset = firmware.assets.find((asset) =>
      asset.name.endsWith("-posix.zip")
    );

    setStatus(Status.DOWNLOADING);
    fetch(asset.url, {
      headers: {
        "Accept": "application/octet-stream",
      }
    })
      .then(function (response) {
        // 2) filter on 200 OK
        if (response.status === 200 || response.status === 0) {
          return Promise.resolve(response.blob());
        } else {
          return Promise.reject(new Error(response.statusText));
        }
      })
      .then(JSZip.loadAsync) // 3) chain with the zip promise
      .then(function (zip) {
        setStatus(Status.EXTRACTING);
        console.log(zip.files);

        const bootLoaderFile = findFileInZip(
          zip,
          "/common/bootloader_dio_80m.bin"
        );
        const bootAppFile = findFileInZip(zip, "/common/boot_app0.bin");
        const firmwareFile = findFileInZip(zip, "/wifi/firmware.bin");
        const partitionsFile = findFileInZip(zip, "/wifi/partitions.bin");

        return Promise.all([
          zip.file(bootLoaderFile.name).async("uint8array"),
          zip.file(bootAppFile.name).async("uint8array"),
          zip.file(firmwareFile.name).async("uint8array"),
          zip.file(partitionsFile.name).async("uint8array"),
        ]);
      })
      .then((files) => {
        setStatus(Status.FLASHING);
        console.log(files);
        const fileArray = [
          {
            data: convertUint8ArrayToBinaryString(files[0]),
            address: parseInt("0x1000"),
          },
          {
            data: convertUint8ArrayToBinaryString(files[1]),
            address: parseInt("0xe000"),
          },
          {
            data: convertUint8ArrayToBinaryString(files[2]),
            address: parseInt("0x10000"),
          },
          {
            data: convertUint8ArrayToBinaryString(files[3]),
            address: parseInt("0x8000"),
          },
        ];

        try {
          return espLoader
            .write_flash(
              fileArray,
              "keep",
              undefined,
              undefined,
              false,
              true,
              (fileIndex, written, total) => {
                let fileName = "Bootloader";
                if (fileIndex == 1) {
                  fileName = "Boot app";
                } else if (fileIndex == 2) {
                  fileName = "Firmware";
                } else {
                  fileName = "Partitions";
                }
                setProgress({
                  fileIndex: fileIndex,
                  fileCount: fileArray.length,
                  fileName: fileName,
                  fileProgress: Math.round((written / total) * 100),
                });
                console.log(fileIndex, written, total);
              },
              (image) => {
                return CryptoJS.MD5(CryptoJS.enc.Latin1.parse(image));
              }
            )
            .finally(() => {
              if (transport)
                transport.disconnect().then(() => {
                  setDevice(null);
                  setTransport(null);
                  setEspLoader(null);
                  setStatus(Status.DONE);
                });
            });
        } catch (e) {
          console.error(e);
          term.writeln(`Error: ${e.message}`);
        } finally {
          console.log("done");
        }
      });
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

          {(status === Status.CONNECTED || status === Status.DOWNLOADING) && (
            <Firmware
              onInstallFirmware={onInstall}
              onDisconnect={onDisconnect}
            />
          )}

          {(status === Status.EXTRACTING || status === Status.FLASHING) && (
            <Progress progress={progress} />
          )}

          {status === Status.DONE && <Done />}
        </div>
      </AppContext.Provider>
    </>
  );
};

export default App;
