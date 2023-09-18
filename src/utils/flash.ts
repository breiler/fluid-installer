import { ESPLoader, FlashOptions, LoaderOptions, Transport } from "esptool-js";
import CryptoJS from "crypto-js";
import { FlashProgress } from "../services/FlashService";
import { NativeSerialPort } from "./serialport/typings";
import { InstallerState } from "../services";

const FLASH_BAUD_RATE = 921600;

export const espLoaderTerminal = {
    clean() {
        //term.clear();
    },
    writeLine(data) {
        console.log(data);
    },
    write(data) {
        console.log(data);
    }
};

export const flashDevice = async (
    serialPort : NativeSerialPort,
    files,
    erase: boolean,
    onProgress: (progress: FlashProgress) => void,
    onState: (state: InstallerState) => void,
    terminal = espLoaderTerminal
) => {
    const transport = new Transport(serialPort);
    try {
        onState(InstallerState.ENTER_FLASH_MODE);
        const loaderOptions = {
            transport,
            baudrate: FLASH_BAUD_RATE,
            terminal: terminal,
          } as LoaderOptions;
        const loader = new ESPLoader(loaderOptions);
        await loader!.main_fn();

        // We need to wait after connecting...
        await new Promise((f) => setTimeout(f, 2000));

        onState(InstallerState.FLASHING);
        const flashOptions: FlashOptions = {
            fileArray: files,
            flashSize: "keep",
            eraseAll: erase,
            compress: true,
            reportProgress: (fileIndex, written, total) => {
                onProgress({
                    fileIndex: fileIndex,
                    fileCount: files.length,
                    fileName: files[fileIndex].fileName,
                    fileProgress: Math.round((written / total) * 100)
                });
            },
            calculateMD5Hash: (image) => CryptoJS.MD5(CryptoJS.enc.Latin1.parse(image)),
          } as FlashOptions;
        await loader!.write_flash(flashOptions);
    } finally {
        onState(InstallerState.RESTARTING);

        // Reset the controller
        await transport.setDTR(false);
        await transport.setRTS(true);
        await new Promise(r => setTimeout(r, 100));
        await transport.setDTR(true);
        await new Promise(r => setTimeout(r, 50));
        await transport.disconnect();
        await new Promise(r => setTimeout(r, 1000));
    }
    return Promise.resolve();
};

export type DeviceInfo = {
    description: string;
    features: string[];
    frequency: number;
    mac: string;
    flashId: number;
    manufacturer: string;
    device: string;
    flashSize: string;
};
