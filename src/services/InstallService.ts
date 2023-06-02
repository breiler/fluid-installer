import {
    FirmwareChoice,
    FirmwareImage,
    GithubRelease,
    GithubReleaseManifest,
    GithubService
} from "./GitHubService";
import { SerialPort } from "../utils/serialport/SerialPort";
import { flashDevice } from "../utils/flash";

export enum FirmwareType {
    WIFI = "wifi",
    BLUETOOTH = "bt"
}

export enum InstallerState {
    SELECT_PACKAGE,
    DOWNLOADING,
    EXTRACTING,
    FLASHING,
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
            onState(InstallerState.FLASHING);
            const flashFiles = await convertImagesToFlashFiles(images, files);
            console.log(flashFiles);
            await flashDevice(
                serialPort.getNativeSerialPort(),
                flashFiles,
                choice.erase || false,
                onProgress
            );
            onState(InstallerState.DONE);
        } catch (error) {
            console.error(error);
            onState(InstallerState.ERROR);
            throw "Was not able to flash device";
        }

        return Promise.resolve();
    }
};
