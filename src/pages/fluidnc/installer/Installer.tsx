import React, { useState } from "react";
import InstallerModal from "../../../modals/installermodal/InstallerModal";
import usePageView from "../../../hooks/usePageView";
import Firmware from "../../../panels/firmware/Firmware";
import {
    FirmwareChoice,
    GithubRelease,
    GithubReleaseManifest,
    GithubService
} from "../../../services/GitHubService";

type InstallerProps = {
    onClose: () => void;
    githubService: GithubService;
};

const Installer = ({ onClose, githubService }: InstallerProps) => {
    usePageView("Installer");

    const [showModal, setShowModal] = useState<boolean>(false);
    const [release, setRelease] = useState<GithubRelease>();
    const [manifest, setManifest] = useState<GithubReleaseManifest>();
    const [choice, setChoice] = useState<FirmwareChoice>();

    return (
        <>
            {showModal && release && manifest && choice && (
                <InstallerModal
                    release={release}
                    manifest={manifest}
                    choice={choice}
                    onClose={onClose}
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

export default Installer;
