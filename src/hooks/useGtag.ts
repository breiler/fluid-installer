const GA_MEASUREMENT_ID = "G-8R42T83QW3";

const useGtag = (): Gtag.Gtag => {
    if (window.gtag !== undefined) {
        return window.gtag;
    }

    (window as any).dataLayer = (window as any).dataLayer || [];

    function gtag() {
        (window as any).dataLayer.push(arguments); // eslint-disable-line
    }

    (window as any).gtag = gtag;
    (gtag as Gtag.Gtag)("js", new Date());
    // We don't send a page view because that's being entirely managed through
    // the 'usePageView' hook.
    (gtag as Gtag.Gtag)("config", GA_MEASUREMENT_ID!, {
        send_page_view: false
    });

    const head = document.head || document.getElementsByTagName("head")[0];
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = `https://googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

    head.appendChild(script);

    return gtag;
};

export default useGtag;
