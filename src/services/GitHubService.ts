export type GithubReleaseAsset = {
    id: number;
    name: string;
};

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
                return releases
                    .filter((release) => !release.draft && !release.prerelease)
                    .filter((release) =>
                        release.assets.filter(
                            (asset) =>
                                asset.name.endsWith("-posix.zip").length > 0
                        )
                    )
                    .sort((release1, release2) => release1.id > release2.id);
            });
    },

    getReleaseAsset: (
        release: GithubRelease
    ): GithubReleaseAsset | undefined => {
        return release.assets.find((asset) =>
            asset.name.endsWith("-posix.zip")
        );
    },

    /**
     * Get the release asset zip data
     *
     * @param asset the release asset to download
     * @returns the asset zip data
     */
    getReleaseAssetZip: (asset: GithubReleaseAsset): Promise<Blob> => {
        const assetUrl =
            "https://raw.githubusercontent.com/breiler/fluid-installer/master/releases/" +
            asset.name;
        return fetch(assetUrl, {
            headers: {
                Accept: "application/octet-stream"
            }
        }).then((response) => {
            if (response.status === 200 || response.status === 0) {
                return Promise.resolve(response.blob());
            } else {
                return Promise.reject(new Error(response.statusText));
            }
        });
    }
};
