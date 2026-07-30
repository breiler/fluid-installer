/**
 * Companion-tool link to the FluidNC config wizard
 * (https://github.com/MitchBradley/FluidNC-config-wizard), a separate
 * single-page tool for building/editing a config.yaml against a specific
 * board's real pinout. WebInstaller opens it in a new tab with
 * ?companion=webinstaller; the wizard recognizes that key (see its own
 * COMPANION_TOOLS map), shows a "Send to WebInstaller" button, and -- once
 * the user clicks it -- posts the finished draft back here via
 * window.postMessage(), so the user never has to manually
 * download-then-reupload the file.
 *
 * WIZARD_BASE_URL is a real, but still-early/unofficial, deployment
 * (a GitHub Pages project site) rather than a stable fluidnc.com
 * subdomain -- update this constant if/when the wizard moves to its
 * permanent home. WIZARD_ORIGIN is derived from it (not hand-typed
 * separately) so the two can never silently drift apart -- it's the
 * value this file trusts both as the popup's location AND as the
 * postMessage sender to accept messages from, so a stale, hand-copied
 * origin string could otherwise open the door to a spoofed message
 * appearing to come from "the wizard" while actually not matching where
 * WebInstaller really sent the user.
 *
 * Known caveat of this being a *.github.io project-page URL rather than a
 * dedicated domain: postMessage's origin check is scheme+host only (no
 * path), and GitHub Pages user sites serve every one of that user's
 * project pages from the SAME host -- so this origin check would also
 * accept a message from any other project this same account happens to
 * publish at mitchbradley.github.io/<other-repo>, not just from the
 * wizard's own path. Real hardening against that (if it ever matters)
 * requires moving the wizard to its own dedicated (sub)domain -- update
 * WIZARD_BASE_URL then, which tightens WIZARD_ORIGIN for free.
 *
 * Local-testing override: rather than hand-editing this constant (easy to
 * forget to revert before pushing), set a `fluidnc-wizard-base-url`
 * localStorage entry in the WebInstaller tab's own devtools console, e.g.
 * while serving the wizard's index.html locally
 * (`cd FluidNC-config-wizard && python3 -m http.server 8000`):
 *
 *   localStorage.setItem("fluidnc-wizard-base-url", "http://localhost:8000")
 *
 * then reload WebInstaller. Clear it (`localStorage.removeItem(...)`) to
 * go back to the real deployed wizard. Falls back to the production
 * WIZARD_BASE_URL whenever the override is unset/empty, so this can't
 * accidentally ship pointed at localhost.
 */
const PRODUCTION_WIZARD_BASE_URL =
    "https://mitchbradley.github.io/FluidNC-config-wizard";
export const WIZARD_BASE_URL =
    (typeof localStorage !== "undefined" &&
        localStorage.getItem("fluidnc-wizard-base-url")) ||
    PRODUCTION_WIZARD_BASE_URL;
export const WIZARD_ORIGIN = new URL(WIZARD_BASE_URL).origin;

// Fixed popup name (not undefined/"_blank") so repeated clicks re-focus the
// SAME wizard tab instead of spawning a new one each time -- window.open()
// with a name matching an already-open tab just refocuses it (and, per MDN,
// still returns that existing window's handle either way).
const WIZARD_WINDOW_NAME = "fluidnc-config-wizard";

export type FluidNCConfigMessage = {
    type: "fluidnc-config";
    version: 1;
    filename: string;
    contents: string;
};

export const isFluidNCConfigMessage = (
    data: unknown
): data is FluidNCConfigMessage =>
    !!data &&
    typeof data === "object" &&
    (data as Record<string, unknown>).type === "fluidnc-config" &&
    (data as Record<string, unknown>).version === 1 &&
    typeof (data as Record<string, unknown>).contents === "string";

// Sent by the wizard tab (see its notifyCompanionReady()) once it's
// actually able to process an incoming config -- i.e. after its own
// schema/role data has loaded, not merely once the tab/DOM exists. This
// is the signal WebInstaller waits for before handing over the file
// currently open in its editor (see ConfigurationModal.tsx's message
// listener) -- posting it any earlier (e.g. right after window.open()
// returns) would race the wizard's own boot sequence and could arrive
// before it's ready to act on it.
export type FluidNCWizardReadyMessage = {
    type: "fluidnc-wizard-ready";
    version: 1;
};

export const isFluidNCWizardReadyMessage = (
    data: unknown
): data is FluidNCWizardReadyMessage =>
    !!data &&
    typeof data === "object" &&
    (data as Record<string, unknown>).type === "fluidnc-wizard-ready" &&
    (data as Record<string, unknown>).version === 1;

/**
 * Opens (or refocuses) the wizard tab with ?companion=webinstaller, which
 * is what makes the wizard show its "Send to WebInstaller" button in the
 * first place -- opening the wizard any other way (a plain link, or this
 * same URL without the query param) intentionally will NOT show that
 * button, since the wizard has no way to tell a legitimate handoff apart
 * from someone just visiting it directly. Returns the opened window (or
 * null if the browser's popup blocker refused it) so the caller can also
 * poll `.closed` if it wants to know when the user is done.
 *
 * Also passes `&origin=<window.location.origin>` -- WebInstaller's OWN
 * real origin, whatever it actually is right now (production
 * installer.fluidnc.com, a local dev server on localhost, a PR preview
 * deploy, ...). The wizard's "Send to WebInstaller" button posts its
 * message back via `window.opener.postMessage(data, targetOrigin)`, and
 * that call silently does nothing if targetOrigin doesn't exactly match
 * the opener's real origin -- so without this param, the wizard would
 * have to guess (or hardcode) that origin, and it would only ever work
 * when WebInstaller happened to be running from the one hardcoded URL.
 * This is exactly the bug reported: WebInstaller running on
 * localhost:1234 opened the real deployed wizard successfully, but
 * "Send to WebInstaller" silently no-op'd because the wizard was
 * addressing its reply to the hardcoded production origin instead of
 * localhost:1234.
 */
export const openWizard = (): Window | null => {
    const params = new URLSearchParams({
        companion: "webinstaller",
        origin: window.location.origin
    });
    return window.open(
        `${WIZARD_BASE_URL}/index.html?${params.toString()}`,
        WIZARD_WINDOW_NAME
    );
};
