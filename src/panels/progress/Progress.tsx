import React from "react";
import { Spinner } from "../../components";
import ProgressBar from "../../components/progressbar/ProgressBar";
import { InstallerState } from "../../services/InstallService";
import { FlashProgress } from "../../services/FlashService";
import PageTitle from "../../components/pagetitle/PageTitle";

type Props = {
    progress: FlashProgress;
    status: InstallerState;
};

const Progress = ({ progress, status }: Props) => {
    const { fileIndex, fileCount, fileProgress } = progress;

    return (
        <>
            <PageTitle>Installing</PageTitle>
            <p>
                {status === InstallerState.DOWNLOADING && (
                    <>
                        Downloading package... <Spinner />
                    </>
                )}
                {status === InstallerState.CHECKING_SIGNATURES && (
                    <>
                        Validating images... <Spinner />
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
