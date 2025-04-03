import { useMatomo } from "@datapunt/matomo-tracker-react";

export enum TrackCategory {
    Install = "Install",
    Connect = "Connect"
}

export enum TrackAction {
    InstallClick = "InstallClick",
    InstallFail = "InstallFail",
    InstallSuccess = "InstallSuccess",
    ConnectionStart = "ConnectionStart",
    ConnectionSuccess = "ConnectionSuccess",
    ConnectionFailed = "ConnectionFailed"
}

const useTrackEvent = () => {
    const { trackEvent } = useMatomo();

    return (
        category: TrackCategory,
        action: TrackAction,
        name?: string,
        value?: number
    ) => trackEvent({ category: category, action: action, name, value });
};

export default useTrackEvent;
