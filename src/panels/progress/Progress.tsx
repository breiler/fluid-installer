import React from "react";
import { Spinner } from "../../components";
import ProgressBar from "../../components/progressbar/ProgressBar";
import { InstallerState } from "../../pages/installer/Installer";

type FileProgress = {
    fileIndex: number;
    fileCount: number;
    fileName: string;
    fileProgress: number;
};

type Props = {
    progress: FileProgress;
    status: InstallerState;
};

const Progress = ({ progress, status }: Props) => {
    const { fileIndex, fileCount, fileName, fileProgress } = progress;

    return (
        <>
            <h2>Installing</h2>
            <p>
                {status === InstallerState.DOWNLOADING && (
                    <>
                        Downloading package... <Spinner />
                    </>
                )}
                {status === InstallerState.EXTRACTING && (
                    <>
                        Extracting package... <Spinner />
                    </>
                )}
                {status === InstallerState.FLASHING && (
                    <>
                        Installing package to device... <Spinner />
                    </>
                )}
            </p>

            <ProgressBar
                maxValue={fileCount * 100}
                currentValue={fileIndex * 100 + fileProgress}
            />
        </>
    );
};

export default Progress;
