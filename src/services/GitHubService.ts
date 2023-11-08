import { convertUint8ArrayToBinaryString } from "../utils/utils";

export type GithubReleaseAsset = {
    id: number;
    name: string;
};

const RESOURCES_BASE_URL =
    "https://raw.githubusercontent.com/bdring/fluidnc-releases/main/releases";

/**
 * Contract for a github release
 * (https://api.github.com/repos/bdring/FluidNC/releases)
 */
export type GithubRelease = {
    id: number;
    name: string;
    body: string;
    url: string;
    draft: boolean;
    prerelease: boolean;
    assets: GithubReleaseAsset[];
};

export type FirmwareImageSignature = {
    algorithm: string;
    value: string;
};

export type FirmwareImage = {
    size: number;
    offset: string;
    path: string;
    signature: FirmwareImageSignature;
};

export type FirmwareChoice = {
    name: string;
    description: string;
    "choice-name": string;
    images: string[] | undefined;
    erase: boolean | undefined;
    choices: FirmwareChoice[];
};

export type GithubReleaseManifest = {
    name: string;
    version: string;
    images: Map<string, FirmwareImage>;
    installable: FirmwareChoice;
};

export const GithubService = {
    /**
     * Fetches all available releases from github
     *
     * @returns a promise with all available github releases
     */
    getReleases: (): Promise<GithubRelease[]> => {
        return fetch("https://api.github.com/repos/bdring/FluidNC/releases")
            .then((res) => res.json())
            .then((releases) => {
                return (
                    releases
                        //.filter((release) => !release.draft && !release.prerelease)
                        .filter(
                            (release) =>
                                new Date(release.created_at) >
                                new Date("2023-06-08T21:23:04Z")
                        )
                        .filter((release) =>
                            release.assets.filter(
                                (asset) =>
                                    asset.name.endsWith("-posix.zip").length > 0
                            )
                        )
                        .sort((release1, release2) => release1.id > release2.id)
                );
            });
    },

    getReleaseManifest: (
        release: GithubRelease
    ): Promise<GithubReleaseManifest> => {
        const manifestBaseUrl = RESOURCES_BASE_URL + "/" + release.name;
        const manifestUrl = manifestBaseUrl + "/manifest.json";

        return fetch(manifestUrl, {
            headers: {
                Accept: "application/json"
            }
        }).then((response) => {
            if (response.status === 200 || response.status === 0) {
                return response.json();
            } else {
                return Promise.reject(new Error(response.statusText));
            }
        });
    },

    getImageFiles: (
        release: GithubRelease,
        images: FirmwareImage[]
    ): Promise<string[]> => {
        const baseUrl = RESOURCES_BASE_URL + "/" + release.name + "/";

        return Promise.all(
            images.map((image) => {
                return fetch(baseUrl + image.path, {
                    headers: {
                        Accept: "application/octet-stream"
                    }
                })
                    .then((response) => {
                        if (response.status === 200 || response.status === 0) {
                            return response.arrayBuffer();
                        } else {
                            return Promise.reject(
                                new Error(response.statusText)
                            );
                        }
                    })
                    .then((buffer) => new Uint8Array(buffer))
                    .then((buffer) => convertUint8ArrayToBinaryString(buffer));
            })
        );
    }
};
