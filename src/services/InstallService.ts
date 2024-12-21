import {
    FirmwareChoice,
    FirmwareImage,
    FirmwareImageSignature,
    GithubRelease,
    GithubReleaseManifest,
    GithubService
} from "./GitHubService";
import { SerialPort } from "../utils/serialport/SerialPort";
import { FlashFile, flashDevice } from "../utils/flash";
import sha256 from "crypto-js/sha256";
import { enc } from "crypto-js/core";
import { analytics, logEvent } from "./FirebaseService";
import { convertUint8ArrayToBinaryString } from "../utils/utils";

export enum FirmwareType {
    WIFI = "wifi",
    BLUETOOTH = "bt"
}

export enum InstallerState {
    SELECT_PACKAGE,
    DOWNLOADING,
    CHECKING_SIGNATURES,
    ENTER_FLASH_MODE,
    FLASHING,
    RESTARTING,
    UPLOADING_FILES,
    DONE,
    ERROR
}

const convertImagesToFlashFiles = (
    images: FirmwareImage[],
    files: Uint8Array[]
): FlashFile[] => {
    if (images.length != files.length) {
        throw new Error("Could not extract files from package");
    }

    images.forEach((image, index) => {
        console.log(
            "Image: " + image.path,
            "Offset: " + image.offset,
            "Image size: " + files[index].length + " bytes"
        );
    });

    return images.map((image, index) => {
        return {
            fileName: image.path,
            data: files[index],
            address: parseInt(image.offset)
        };
    });
};

export const InstallService = {
    installChoice: async (
        release: GithubRelease,
        serialPort: SerialPort,
        manifest: GithubReleaseManifest,
        choice: FirmwareChoice,
        onProgress: (FlashProgress) => void,
        onState: (state: InstallerState) => void,
        onLogData: (data: string) => void,
        baud: number
    ): Promise<void> => {
        onState(InstallerState.DOWNLOADING);

        const images = choice.images?.map(
            (imageName) => manifest.images[imageName]
        ) as FirmwareImage[];

        let imageFiles: Uint8Array[] = [];
        try {
            imageFiles = await GithubService.getImageFiles(release, images);
        } catch (error) {
            logEvent(analytics, "install", {
                version: release.name,
                success: false,
                error: error
            });

            console.error(error);
            onState(InstallerState.ERROR);
            throw "Could not download image files";
        }

        try {
            onState(InstallerState.CHECKING_SIGNATURES);
            validateImageSignatures(images, imageFiles);
        } catch (error) {
            logEvent(analytics, "install", {
                version: release.name,
                success: false,
                error: error
            });

            onState(InstallerState.ERROR);
            throw error;
        }

        try {
            const flashFiles = await convertImagesToFlashFiles(
                images,
                imageFiles
            );
            await flashDevice(
                serialPort.getNativeSerialPort(),
                flashFiles,
                choice.erase || false,
                baud,
                onProgress,
                onState,
                onLogData
            );

            logEvent(analytics, "install", {
                version: release.name,
                success: true
            });
        } catch (error) {
            logEvent(analytics, "install", {
                version: release.name,
                success: false,
                error: error
            });

            console.error(error);
            onState(InstallerState.ERROR);
            throw "Was not able to flash device: " + error;
        }

        return Promise.resolve();
    }
};
export const validateImageSignatures = (
    images: FirmwareImage[],
    files: Uint8Array[]
) => {
    images.forEach((image, index) => {
        validateSignature(image.signature, files[index]);
    });
};

export const validateSignature = (
    signature: FirmwareImageSignature,
    data: Uint8Array
) => {
    if (signature.algorithm === "SHA2-256") {
        const sign = sha256(
            enc.Latin1.parse(convertUint8ArrayToBinaryString(data))
        ).toString();
        if (signature.value !== sign) {
            console.error(
                "The files is possible corrupt. Signature was " +
                    sign +
                    ", expected " +
                    signature.value
            );
            throw "The file might be corrupt as its signature does not match the manifest.";
        }
    } else {
        throw (
            "The file has an unknown signature algorithm: " +
            signature.algorithm
        );
    }
};
