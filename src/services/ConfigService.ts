import { GithubService, GithubTreeFile } from "./GitHubService";

export type ConfigBoard = {
    name: string;
    path: string;
    files: ConfigFile[];
};

export type ConfigFile = {
    name: string;
    path: string;
    size: number;
    url: string;
};

const ConfigService = {
    getBoards: () => {
        return GithubService.getConfigTree().then((configTree) =>
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
                    files: ConfigService.getConfigs(configTree.tree, node.path)
                }))
                .filter((board) => board.files.length)
        );
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
                const fileName = node.path
                    .substring(node.path.lastIndexOf("/") + 1)
                    .replace(".yaml", "")
                    .replaceAll("_", " ");
                return {
                    name: fileName,
                    path: node.path,
                    size: node.size,
                    sha: node.sha,
                    url: node.url
                };
            });
    }
};

export default ConfigService;
