import { useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";
import useGtag from "./useGtag";

const usePageView = (pageTitle: string) => {
    const location = useLocation();
    const gtag = useGtag();

    const page_location = useMemo(() => location.pathname, [location]);

    useEffect(() => {
        gtag("event", "page_view", {
            page_location,
            page_title: pageTitle
        });
    }, [gtag, page_location, pageTitle]);
};

export default usePageView;
