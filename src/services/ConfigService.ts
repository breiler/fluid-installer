import {
    CONFIG_BASE_URL,
    GithubService,
    GithubTreeFile
} from "./GitHubService";

export type ConfigBoard = {
    name: string;
    path: string;
    files: ConfigFile[];
    logoUrl?: string;
    boardImageUrl?: string;
};

export type ConfigFile = {
    name: string;
    path: string;
    size: number;
    url: string;
};

const ConfigService = {
    getBoards: () => {
        return new GithubService().getConfigTree().then((configTree) =>
            configTree.tree
                .filter(
                    (node) =>
                        node.path.startsWith("contributed/") &&
                        node.type === "tree"
                )
                .map((node) => ({
                    name: node.path
                        .replace("contributed/", "")
                        .replaceAll("_", " "),
                    path: node.path,
                    files: ConfigService.getConfigs(configTree.tree, node.path),
                    logoUrl: ConfigService.getLogoUrl(
                        configTree.tree,
                        node.path
                    ),
                    boardImageUrl: ConfigService.getBoardImageUrl(
                        configTree.tree,
                        node.path
                    )
                }))
                .filter((board) => board.files.length)
        );
    },

    getLogoUrl: (files: GithubTreeFile[], path: string) => {
        return files
            .filter((node) => node.type === "blob")
            .filter((node) => {
                const fileName = node.path.substring(
                    node.path.lastIndexOf("/") + 1
                );
                return node.path === path + "/" + fileName;
            })
            .filter(
                (node) =>
                    node.path.endsWith("/logo.svg") ||
                    node.path.endsWith("/logo.png")
            )
            .map((node) => CONFIG_BASE_URL + "/" + node.path)
            .find((node) => node);
    },

    getBoardImageUrl: (files: GithubTreeFile[], path: string) => {
        return files
            .filter((node) => node.type === "blob")
            .filter((node) => {
                const fileName = node.path.substring(
                    node.path.lastIndexOf("/") + 1
                );
                return node.path === path + "/" + fileName;
            })
            .filter(
                (node) =>
                    node.path.endsWith("/board.svg") ||
                    node.path.endsWith("/board.png") ||
                    node.path.endsWith("/board.jpg")
            )
            .map((node) => CONFIG_BASE_URL + "/" + node.path)
            .find((node) => node);
    },

    getConfigs: (files: GithubTreeFile[], path: string) => {
        return files
            .filter((node) => node.type === "blob")
            .filter((node) => {
                const fileName = node.path.substring(
                    node.path.lastIndexOf("/") + 1
                );
                return node.path === path + "/" + fileName;
            })
            .filter((node) => node.path.endsWith(".yaml"))
            .map((node) => {
                const name = node.path
                    .substring(node.path.lastIndexOf("/") + 1)
                    .replace(".yaml", "")
                    .replaceAll("_", " ");

                const fileName = node.path.substring(
                    node.path.lastIndexOf("/") + 1
                );

                const configUrl = CONFIG_BASE_URL + "/" + path + "/" + fileName;
                return {
                    name: name,
                    path: node.path,
                    size: node.size,
                    sha: node.sha,
                    url: configUrl
                };
            });
    }
};

export default ConfigService;
