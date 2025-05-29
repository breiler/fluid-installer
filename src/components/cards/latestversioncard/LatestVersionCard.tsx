import React, { useEffect, useState } from "react";
import { GithubRelease, GithubService } from "../../../services";
import VersionCard from "../versioncard/VersionCard";
import "./LatestVersionCard.scss";

const LatestVersionCard = () => {
    const [latestRelease, setLatestRelease] = useState<GithubRelease>();

    useEffect(() => {
        setLatestRelease(undefined);
        new GithubService()
            .getReleases()
            .then(async (releases) => {
                setLatestRelease(releases[0]);
            })
            .catch((error) => {
                console.error("Could not fetch releases", error);
                setLatestRelease(undefined);
            });
    }, []);

    return (
        <div className="latestVersionCard">
            <VersionCard release={latestRelease} isLatest={true} />
        </div>
    );
};

export default LatestVersionCard;
