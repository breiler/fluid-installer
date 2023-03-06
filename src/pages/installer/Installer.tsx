import React, { useState } from "react";

import Progress from "../../panels/progress/Progress";
import Done from "../../panels/done/Done";
import Firmware from "../../panels/firmware/Firmware";
import {
    convertToFlashFiles,
    fetchAsset,
    FirmwareType,
    unzipAssetData
} from "../../utils/utils";
import { flashDevice } from "../../utils/flash";

export enum InstallerState {
    SELECT_PACKAGE,
    DOWNLOADING,
    EXTRACTING,
    FLASHING,
    DONE,
    ERROR
}

const initialProgress = {
    fileIndex: 0,
    fileCount: 1,
    fileName: "",
    fileProgress: 0
};

const Installer = ({ onClose, serialPort }) => {
    const [status, setStatus] = useState(InstallerState.SELECT_PACKAGE);
    const [progress, setProgress] = useState(initialProgress);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    const onInstall = async (
        firmware,
        firmwareType: FirmwareType = FirmwareType.WIFI
    ) => {
        console.log("Installing " + firmware.name + " with " + firmwareType);
        const asset = firmware.assets.find((asset) =>
            asset.name.endsWith("-posix.zip")
        );

        let zipData: Blob | undefined = undefined;
        try {
            setStatus(InstallerState.DOWNLOADING);
            zipData = await fetchAsset(asset);
        } catch (error) {
            console.error(error);
            setErrorMessage("Could not download package");
            setStatus(InstallerState.ERROR);
            return;
        }

        let files: any[] | undefined;
        try {
            setStatus(InstallerState.EXTRACTING);
            files = await unzipAssetData(zipData, firmwareType);
        } catch (error) {
            console.error(error);
            setErrorMessage("Could not unzip package, it seems corrupted");
            setStatus(InstallerState.ERROR);
            return;
        }

        try {
            setStatus(InstallerState.FLASHING);
            const flashFiles = convertToFlashFiles(files!);
            await flashDevice(serialPort, flashFiles, setProgress);
            setStatus(InstallerState.DONE);
        } catch (error) {
            console.error(error);
            setErrorMessage("Was not able to flash device");
            setStatus(InstallerState.ERROR);
            return;
        }
    };

    return (
        <>
            {status === InstallerState.SELECT_PACKAGE && (
                <Firmware onInstallFirmware={onInstall} />
            )}

            {(status === InstallerState.DOWNLOADING ||
                status === InstallerState.EXTRACTING ||
                status === InstallerState.FLASHING) && (
                <Progress progress={progress} status={status} />
            )}

            {status === InstallerState.DONE && <Done onContinue={onClose} />}
            {status === InstallerState.ERROR && (
                <div className="alert alert-danger">{errorMessage}</div>
            )}
        </>
    );
};

export default Installer;
