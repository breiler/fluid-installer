import React, { useCallback, useContext, useEffect, useState } from "react";

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

    const onInstall = async (
        firmware,
        firmwareType: FirmwareType = FirmwareType.WIFI
    ) => {
        console.log("Installing " + firmware.name + " with " + firmwareType);
        const asset = firmware.assets.find((asset) =>
            asset.name.endsWith("-posix.zip")
        );

        try {
            setStatus(InstallerState.DOWNLOADING);
            const zipData = await fetchAsset(asset);

            setStatus(InstallerState.EXTRACTING);
            const files = await unzipAssetData(zipData, firmwareType);

            setStatus(InstallerState.FLASHING);
            const flashFiles = convertToFlashFiles(files);
            await flashDevice(serialPort, flashFiles, setProgress);
        } catch (error) {
            console.error(error);
            setStatus(InstallerState.ERROR);
        }

        setStatus(InstallerState.DONE);
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

            {status === InstallerState.DONE && (
                <Done onContinue={onClose} />
            )}
            {status === InstallerState.ERROR && <>Bollocks!</>}

        </>
    );
};

export default Installer;
