import { ESPLoader, Transport } from "esptool-js";
import CryptoJS from "crypto-js";

const FLASH_BAUD_RATE = 921600;

let espLoaderTerminal = {
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
    serialPort,
    files,
    onProgress,
    terminal = espLoaderTerminal
) => {
    const transport = new Transport(serialPort);
    try {
        const loader = new ESPLoader(transport, FLASH_BAUD_RATE, terminal);
        await loader!.main_fn();

        // We need to wait after connecting...
        await new Promise((f) => setTimeout(f, 2000));
        await loader!.write_flash(
            files,
            "keep",
            undefined,
            undefined,
            false,
            true,
            (fileIndex, written, total) => {
                onProgress({
                    fileIndex: fileIndex,
                    fileCount: files.length,
                    fileName: files[fileIndex].fileName,
                    fileProgress: Math.round((written / total) * 100)
                });
            },
            (image) => {
                return CryptoJS.MD5(CryptoJS.enc.Latin1.parse(image));
            }
        );
    } finally {
        // Reset the controller
        await transport.setDTR(false);
        await new Promise((resolve) => setTimeout(resolve, 100));
        await transport.setDTR(true);
        await transport.disconnect();
    }
    return Promise.resolve();
};
