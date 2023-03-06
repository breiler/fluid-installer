// FileArray is a TS type
import { FullFileBrowser, ChonkyActions } from "chonky";
import React from "react";

const FileBrowser = () => {
    const files = [
        {
            id: "mcd",
            name: "Work in progress.txt"
        }
    ];
    const folderChain = [{ id: "xcv", name: "LocalFS", isDir: true }];

    const myFileActions = [
        ChonkyActions.UploadFiles,
        ChonkyActions.DownloadFiles
    ];

    return (
        <div style={{ height: 300 }}>
            <FullFileBrowser
                files={files}
                folderChain={folderChain}
                fileActions={myFileActions}
                disableDragAndDrop={true}
                disableDefaultFileActions={true}
            />
        </div>
    );
};

export default FileBrowser;
