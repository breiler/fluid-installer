import { useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { analytics, logEvent } from "../services/FirebaseService";

const usePageView = (pageTitle: string) => {
    const location = useLocation();
    const page_location = useMemo(() => location.pathname, [location]);

    useEffect(() => {
        logEvent(analytics, "page_view", {
            page_location,
            page_title: pageTitle
        });
    }, [page_location, pageTitle]);
};

export default usePageView;
