export type FlashProgress = {
    /**
     * The current file index in progress
     */
    fileIndex: number;

    /**
     * Total number of files to flash
     */
    fileCount: number;

    /**
     * The file currently in progress
     */
    fileName: string;

    /**
     * 
     */
    fileProgress: number;
};

export const FlashService = {};
