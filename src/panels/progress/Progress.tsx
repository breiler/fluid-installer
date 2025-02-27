import React from "react";
import { Spinner } from "../../components";
import ProgressBar from "../../components/progressbar/ProgressBar";
import { InstallerState } from "../../services/InstallService";
import { FlashProgress } from "../../services/FlashService";
import { useTranslation } from "react-i18next";

type Props = {
    progress: FlashProgress;
    status: InstallerState;
};

const Progress = ({ progress, status }: Props) => {
    const { fileIndex, fileCount, fileProgress } = progress;
    const { t } = useTranslation();

    return (
        <>
            <h3>{t("panel.progress.title")}</h3>
            <p>
                {status === InstallerState.DOWNLOADING && (
                    <>
                        {t("panel.progress.downloading")} <Spinner />
                    </>
                )}
                {status === InstallerState.CHECKING_SIGNATURES && (
                    <>
                        {t("panel.progress.validating")} <Spinner />
                    </>
                )}
                {status === InstallerState.FLASHING && (
                    <>
                        {t("panel.progress.flashing")} <Spinner />
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
