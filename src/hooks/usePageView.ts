import { useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { analytics, logEvent } from "../services/FirebaseService";
import { useMatomo } from "@datapunt/matomo-tracker-react";

const usePageView = (pageTitle: string) => {
    const location = useLocation();
    const page_location = useMemo(() => location.pathname, [location]);
    const { trackPageView } = useMatomo();
    useEffect(() => {
        logEvent(analytics, "page_view", {
            page_location,
            page_title: pageTitle
        });

        trackPageView({ documentTitle: pageTitle });
    }, [page_location, pageTitle]);
};

export default usePageView;
