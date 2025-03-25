import { useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useMatomo } from "@datapunt/matomo-tracker-react";

const usePageView = (pageTitle: string) => {
    const location = useLocation();
    const pageLocation = useMemo(() => location.pathname, [location]);
    const { trackPageView } = useMatomo();
    useEffect(() => {
        trackPageView({ documentTitle: pageTitle });
    }, [pageLocation, pageTitle]);
};

export default usePageView;
