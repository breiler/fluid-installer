import JSZip from "jszip";

export const isSafari = () => {
    return (
        navigator.vendor &&
        navigator.vendor.indexOf("Apple") > -1 &&
        navigator.userAgent &&
        navigator.userAgent.indexOf("CriOS") == -1 &&
        navigator.userAgent.indexOf("FxiOS") == -1
    );
};

/**
 *
 * @param {uint8array} u8Array
 * @returns
 */
export const convertUint8ArrayToBinaryString = (u8Array) => {
    var i,
        len = u8Array.length,
        b_str = "";
    for (i = 0; i < len; i++) {
        b_str += String.fromCharCode(u8Array[i]);
    }
    return b_str;
};

const CORS_PROXY_URL = "https://breiler.com/proxy/?url=";

/**
 *
 * @param {{browser_download_url:string}} asset
 * @returns
 */
export const fetchAsset = async (asset) => {
    return fetch(asset.url, {
        headers: {
            "Accept": "application/octet-stream",
            "X-GitHub-Api-Version": "2022-11-28"
        }
    }).then(
        (response) => {
            if (response.status === 200 || response.status === 0) {
                return Promise.resolve(response.blob());
            } else {
                return Promise.reject(new Error(response.statusText));
            }
        }
    );
};

const findFileInZip = (zip: any, fileName: any): any => {
    const file = Object.values(zip.files).find((file: any) =>
        file.name.endsWith(fileName)
    );
    if (!file) {
        throw new Error("Missing file '" + fileName + "' from package");
    }
    return file;
};

export enum FirmwareType {
    WIFI = "wifi",
    BLUETOOTH = "bt"
}

/**
 * Unzips the given data and returns a promise with four files
 * @param {string} zipData
 * @param {FirmwareType} firmwareType
 * @returns
 */
export const unzipAssetData = (
    zipData: any,
    firmwareType = FirmwareType.WIFI
) => {
    return JSZip.loadAsync(zipData).then((zip: any) => {
        const bootLoaderFile = findFileInZip(
            zip,
            "/common/bootloader_dio_80m.bin"
        );
        const bootAppFile = findFileInZip(zip, "/common/boot_app0.bin");
        const firmwareFile = findFileInZip(
            zip,
            "/" + firmwareType + "/firmware.bin"
        );
        const partitionsFile = findFileInZip(
            zip,
            "/" + firmwareType + "/partitions.bin"
        );

        return Promise.all([
            zip.file(bootLoaderFile.name).async("uint8array"),
            zip.file(bootAppFile.name).async("uint8array"),
            zip.file(firmwareFile.name).async("uint8array"),
            zip.file(partitionsFile.name).async("uint8array")
        ]);
    });
};

export const convertToFlashFiles = (files: any[]) => {
    if (files?.length != 4) {
        throw new Error("Could not extract files from package");
    }
    return [
        {
            fileName: "Bootloader",
            data: convertUint8ArrayToBinaryString(files[0]),
            address: parseInt("0x1000")
        },
        {
            fileName: "Boot app",
            data: convertUint8ArrayToBinaryString(files[1]),
            address: parseInt("0xe000")
        },
        {
            fileName: "Firmware",
            data: convertUint8ArrayToBinaryString(files[2]),
            address: parseInt("0x10000")
        },
        {
            fileName: "Partitions",
            data: convertUint8ArrayToBinaryString(files[3]),
            address: parseInt("0x8000")
        }
    ];
};

export const checkConnection = async (serialPortDevice) => {
    return serialPortDevice.open({ baudRate: 115200 }).then(() => serialPortDevice.close());
};
