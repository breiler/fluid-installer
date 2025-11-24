import {
    ClassicReset,
    ESPLoader,
    FlashOptions,
    LoaderOptions,
    ResetConstructors,
    Transport
} from "esptool-js";
import CryptoJS from "crypto-js";
import { FlashProgress } from "../services/FlashService";
import { NativeSerialPort } from "./serialport/typings";
import { InstallerState } from "../services";
import { convertUint8ArrayToBinaryString } from "./utils";

export type FlashFile = {
    fileName: string;
    data: Uint8Array;
    address: number;
};

/**
 * Custom reset sequence
 */
const resetConstructors: ResetConstructors = {
    classicReset: (transport: Transport, resetDelay: number) => {
        const classicReset = new ClassicReset(transport, resetDelay);

        // Override the reset function
        classicReset.reset = async () => {
            const serialDevice: NativeSerialPort = transport.device;

            // D0|R1|W100|D1|R0|W50|D0
            await serialDevice.setSignals({
                dataTerminalReady: false,
                requestToSend: true
            });
            await new Promise((r) => setTimeout(r, 100));
            await serialDevice.setSignals({
                dataTerminalReady: true,
                requestToSend: false
            });
            await new Promise((r) => setTimeout(r, 50));
            await serialDevice.setSignals({
                dataTerminalReady: false,
                requestToSend: false
            });
            return Promise.resolve();
        };

        return classicReset;
    }
};

export const flashDevice = async (
    serialPort: NativeSerialPort,
    files: FlashFile[],
    erase: boolean,
    baud: number,
    onProgress: (progress: FlashProgress) => void,
    onState: (state: InstallerState) => void,
    onLogData: (data: string) => void
) => {
    const terminal = {
        clean() {},
        writeLine(data) {
            onLogData(data + "\n");
        },
        // eslint-disable-next-line
        write(data) {}
    };

    const transport = new Transport(serialPort);
    let loader: ESPLoader;
    try {
        onState(InstallerState.ENTER_FLASH_MODE);
        const loaderOptions = {
            transport,
            baudrate: baud,
            terminal: terminal,
            resetConstructors: resetConstructors
        } as LoaderOptions;
        loader = new ESPLoader(loaderOptions);
        await loader!.main();

        // We need to wait after connecting...
        await new Promise((f) => setTimeout(f, 2000));

        onState(InstallerState.FLASHING);
        const flashOptions: FlashOptions = {
            fileArray: files.map((f) => ({
                address: f.address,
                data: convertUint8ArrayToBinaryString(f.data)
            })),
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
            calculateMD5Hash: (image) =>
                CryptoJS.MD5(CryptoJS.enc.Latin1.parse(image))
        } as FlashOptions;
        await loader!.writeFlash(flashOptions);
    } finally {
        onState(InstallerState.RESTARTING);

        // Reset the controller
        await transport.setDTR(false);
        await transport.setRTS(true);
        await new Promise((r) => setTimeout(r, 100));
        await transport.setRTS(false);
        await new Promise((r) => setTimeout(r, 50));
        await transport.disconnect();
        await new Promise((r) => setTimeout(r, 1000));
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
