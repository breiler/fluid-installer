import { useMatomo } from "@datapunt/matomo-tracker-react";

export enum TrackCategory {
    Start = "Start",
    Install = "Install",
    Connect = "Connect",
    Disconnect = "Disconnect",
    Restart = "Restart"
}

export enum TrackAction {
    Start = "Start",
    InstallClick = "InstallClick",
    InstallFail = "InstallFail",
    InstallSuccess = "InstallSuccess",
    ConnectionStart = "ConnectionStart",
    ConnectionSuccess = "ConnectionSuccess",
    ConnectionFailed = "ConnectionFailed",
    DisconnectClick = "DisconnectClick",
    RestartClick = "RestartClick"
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
