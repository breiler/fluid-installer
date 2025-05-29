export type GithubReleaseAsset = {
    id: number;
    name: string;
};
export const FLUIDNC_RELEASES_API =
    "https://api.github.com/repos/bdring/FluidNC/releases";

export const FLUIDNC_RESOURCES_BASE_URL =
    "https://raw.githubusercontent.com/bdring/fluidnc-releases/main/releases";

export const FLUIDDIAL_RELEASES_API =
    "https://api.github.com/repos/bdring/FluidNC/releases";

export const FLUIDDIAL_RESOURCES_BASE_URL =
    "https://raw.githubusercontent.com/bdring/fluiddial-releases/main/releases";

export const CONFIG_BASE_URL =
    "https://raw.githubusercontent.com/breiler/fluidnc-config-files/refs/heads/fluid-installer";

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
    published_at: string;
};

export type GithubTree = {
    sha: string;
    url: string;
    tree: GithubTreeFile[];
};

export type GithubTreeFile = {
    path: string;
    type: "blob" | "tree";
    sha: string;
    size: number;
    url: string;
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

export type FirmwareFile = {
    size: number;
    "controller-path": string;
    path: string;
    signature: FirmwareImageSignature;
};

export type GithubReleaseManifest = {
    name: string;
    version: string;
    images: Map<string, FirmwareImage>;
    files?: Map<string, FirmwareFile>;
    installable: FirmwareChoice;
};

let configTree: GithubTree;

export class GithubService {
    private apiURL: string;
    private resourcesURL: string;

    constructor(apiURL?: string, resourcesURL?: string) {
        if (apiURL) {
            this.apiURL = apiURL;
        } else {
            this.apiURL = FLUIDNC_RELEASES_API;
        }

        if (resourcesURL) {
            this.resourcesURL = resourcesURL;
        } else {
            this.resourcesURL = FLUIDDIAL_RESOURCES_BASE_URL;
        }
    }

    /**
     * Fetches all available releases from github
     *
     * @returns a promise with all available github releases
     */
    getReleases(includePrerelease: boolean = false): Promise<GithubRelease[]> {
        return fetch(this.apiURL)
            .then((res) => res.json())
            .then((releases) => {
                return releases
                    .filter(
                        (release) =>
                            includePrerelease ||
                            (!release.draft && !release.prerelease)
                    )
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
                    .sort((release1, release2) => release2?.id - release1?.id);
            });
    }

    getConfigTree(): Promise<GithubTree> {
        // If the file has been retreived, return a cached variant
        if (configTree) {
            return Promise.resolve(configTree);
        }

        return fetch(
            "https://api.github.com/repos/breiler/fluidnc-config-files/git/trees/fluid-installer?recursive=true",
            {
                headers: {
                    Accept: "application/json"
                }
            }
        ).then((response) => {
            if (response.status === 200 || response.status === 0) {
                return response.json().then((data) => {
                    configTree = data;
                    return data;
                });
            } else {
                return Promise.reject(new Error(response.statusText));
            }
        });
    }

    getReleaseManifest(release: GithubRelease): Promise<GithubReleaseManifest> {
        const manifestBaseUrl = FLUIDNC_RESOURCES_BASE_URL + "/" + release.name;
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
    }

    getImageFiles(
        release: GithubRelease,
        images: FirmwareImage[]
    ): Promise<Uint8Array[]> {
        const baseUrl = FLUIDNC_RESOURCES_BASE_URL + "/" + release.name + "/";

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
                    .then((buffer) => new Uint8Array(buffer));
            })
        );
    }

    getExtraFile(
        release: GithubRelease,
        file: FirmwareFile
    ): Promise<Uint8Array> {
        const baseUrl = FLUIDNC_RESOURCES_BASE_URL + "/" + release.name + "/";

        return fetch(baseUrl + file.path, {
            headers: {
                Accept: "application/octet-stream"
            }
        })
            .then((response) => {
                if (response.status === 200 || response.status === 0) {
                    return response.arrayBuffer();
                } else {
                    return Promise.reject(new Error(response.statusText));
                }
            })
            .then((buffer) => new Uint8Array(buffer));
    }
}
