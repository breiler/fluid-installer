import React, { useMemo, useState } from "react";
import {
    FLUIDDIAL_RELEASES_API,
    FLUIDDIAL_RESOURCES_BASE_URL,
    FirmwareChoice,
    GithubRelease,
    GithubReleaseManifest,
    GithubService
} from "../../../services";
import { Firmware } from "../../../panels";
import usePageView from "../../../hooks/usePageView";
import InstallerModal from "../../../modals/fluiddial/installermodal/InstallerModal";

const FluidDialHomePage = () => {
    usePageView("FluidDial Installer");

    const [showModal, setShowModal] = useState<boolean>(false);
    const [release, setRelease] = useState<GithubRelease>();
    const [manifest, setManifest] = useState<GithubReleaseManifest>();
    const [choice, setChoice] = useState<FirmwareChoice>();

    const githubService = useMemo(
        () =>
            new GithubService(
                FLUIDDIAL_RELEASES_API,
                FLUIDDIAL_RESOURCES_BASE_URL
            ),
        []
    );

    return (
        <>
            {showModal && release && manifest && choice && (
                <InstallerModal
                    githubService={githubService}
                    release={release}
                    manifest={manifest}
                    choice={choice}
                    onClose={() => {
                        setRelease(undefined);
                        setManifest(undefined);
                        setChoice(undefined);
                        setShowModal(false);
                    }}
                    onCancel={() => setShowModal(false)}
                />
            )}
            <Firmware
                githubService={githubService}
                onInstall={(release, manifest, choice) => {
                    setRelease(release);
                    setManifest(manifest);
                    setChoice(choice);
                    setShowModal(true);
                }}
            />
        </>
    );
};

export default FluidDialHomePage;
