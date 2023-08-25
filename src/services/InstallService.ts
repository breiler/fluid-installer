import {
    FirmwareChoice,
    FirmwareImage,
    GithubRelease,
    GithubReleaseManifest,
    GithubService
} from "./GitHubService";
import { SerialPort } from "../utils/serialport/SerialPort";
import { flashDevice } from "../utils/flash";
import sha256 from "crypto-js/sha256";
import { enc } from "crypto-js/core";

export enum FirmwareType {
    WIFI = "wifi",
    BLUETOOTH = "bt"
}

export enum InstallerState {
    SELECT_PACKAGE,
    DOWNLOADING,
    CHECKING_SIGNATURES,
    FLASHING,
    FLASH_DONE,
    DONE,
    ERROR
}

const convertImagesToFlashFiles = (
    images: FirmwareImage[],
    files: string[]
) => {
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
        onState: (state: InstallerState) => void
    ): Promise<void> => {
        onState(InstallerState.DOWNLOADING);

        const images = choice.images?.map(
            (imageName) => manifest.images[imageName]
        ) as FirmwareImage[];

        let files: string[] = [];
        try {
            files = await GithubService.getImageFiles(release, images);
        } catch (error) {
            console.error(error);
            onState(InstallerState.ERROR);
            throw "Could not download image files";
        }

        try {
            onState(InstallerState.CHECKING_SIGNATURES);
            validateImageSignatures(images, files);
        } catch (error) {
            onState(InstallerState.ERROR);
            throw error;
        }

        try {
            const flashFiles = await convertImagesToFlashFiles(images, files);
            onState(InstallerState.FLASHING);
            await flashDevice(
                serialPort.getNativeSerialPort(),
                flashFiles,
                choice.erase || false,
                onProgress
            ).then(() => onState(InstallerState.FLASH_DONE));
            onState(InstallerState.FLASH_DONE);

            if (window.gtag) {
                window.gtag('event', 'install', { version: release.name });
            }
        } catch (error) {
            console.error(error);
            onState(InstallerState.ERROR);
            throw "Was not able to flash device";
        }

        return Promise.resolve();
    }
};
function validateImageSignatures(images: FirmwareImage[], files: string[]) {
    images.forEach((image, index) => {
        if (image.signature.algorithm === "SHA2-256") {
            const signature = sha256(enc.Latin1.parse(files[index])).toString();
            if (image.signature.value !== signature) {
                console.error(
                    "The image " +
                    image.path +
                    " is possible corrupt. Signature was " +
                    signature +
                    " but manifest says " +
                    image.signature.value
                );
                throw (
                    "The image " +
                    image.path +
                    " might be corrupt as its signature does not match the manifest."
                );
            }
        } else {
            throw (
                "The image " +
                image.path +
                " has an unknown signature algorithm: " + image.signature.algorithm
            );
        }
    });
}

