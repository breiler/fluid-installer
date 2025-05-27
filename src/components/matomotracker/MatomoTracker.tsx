import { MatomoProvider, createInstance } from "@datapunt/matomo-tracker-react";
import React, { ReactNode, useEffect } from "react";
import useTrackEvent, {
    TrackAction,
    TrackCategory
} from "../../hooks/useTrackEvent";

type Props = {
    children: ReactNode;
};

const MatomoTracker = ({ children }: Props) => {
    const instance = createInstance({
        urlBase: "https://matomo.bitpusher.se/",
        siteId: 2
    });

    const trackEvent = useTrackEvent();
    useEffect(() => {
        trackEvent(TrackCategory.Start, TrackAction.Start);
    }, []);

    return <MatomoProvider value={instance}>{children}</MatomoProvider>;
};

export default MatomoTracker;
