import React, { useEffect, useRef, useState } from "react";
import { Buffer } from "buffer";
import { Button, Spinner } from "../../components";
import AlertMessage from "../../components/alertmessage/AlertMessage";
import { Modal } from "react-bootstrap";
import {
    faSave,
    faClose,
    faExternalLink
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import Configuration, {
    ConfigurationTab
} from "../../panels/configuration/Configuration";
import ConfigurationTabs from "../../panels/configuration/ConfigurationTabs";
import { ControllerFile } from "../../services/controllerservice";
import CreateFileModal from "../createfilemodal/CreateFileModal";
import { generateNewFileName } from "../../utils/utils";
import { ButtonType } from "../../components/button";
import {
    isFluidNCConfigMessage,
    isFluidNCWizardReadyMessage,
    openWizard,
    WIZARD_ORIGIN
} from "../../services/WizardService";

type ConfigurationModalProps = {
    file?: ControllerFile;
    fileData?: Buffer;
    createNew: boolean;
    onClose: () => void;
    onSave: (file: ControllerFile, fileData: Buffer) => Promise<void>;
};

const ConfigurationModal = ({
    file,
    fileData,
    createNew,
    onClose,
    onSave
}: ConfigurationModalProps) => {
    const [value, setValue] = useState<string>(fileData?.toString() || "");
    const [hasErrors, setHasErrors] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [showSaveAs, setShowSaveAs] = useState<boolean>(false);
    const [tab, setTab] = useState<ConfigurationTab>(ConfigurationTab.GENERAL);
    const [receivedFromWizard, setReceivedFromWizard] =
        useState<boolean>(false);
    // Tracks the wizard popup only so a stale/closed handle isn't reused;
    // openWizard() itself already refocuses an existing same-named tab, so
    // this is just for our own bookkeeping, not a second focus mechanism.
    // Also doubles as the target for handing OUR current file over to the
    // wizard once it signals it's ready (see the "fluidnc-wizard-ready"
    // branch below).
    const wizardWindowRef = useRef<Window | null>(null);
    // The message listener below is registered once (empty dep array) so
    // its closure would otherwise see only the `value`/`file` from the
    // render it was created in -- these refs are kept in sync on every
    // render instead, so "hand the wizard our current file" always sends
    // whatever's actually in the editor right now, not a stale snapshot
    // from whenever the modal first mounted.
    const valueRef = useRef(value);
    useEffect(() => {
        valueRef.current = value;
    }, [value]);
    const fileRef = useRef(file);
    useEffect(() => {
        fileRef.current = file;
    }, [file]);

    // Companion-tool handoff: listens for the wizard tab (opened below via
    // openWizard()) posting the finished draft back via window.postMessage
    // -- see WizardService.ts's own comment for the full handshake. Only
    // ever accepts a message whose origin is the wizard's own known origin
    // (never "*"/unchecked -- this replaces the file the user is about to
    // upload to their controller) and whose shape matches the wizard's
    // documented "fluidnc-config" message. Registered for the modal's
    // whole lifetime (not gated on `file` being set) since the listener
    // itself is a no-op until a matching message actually arrives -- kept
    // that way to avoid a race between the modal opening and the user
    // clicking "Open in Wizard" in the popup.
    useEffect(() => {
        const onMessage = (event: MessageEvent) => {
            // Logged permanently (not just during development) -- this is
            // the only visibility into a handoff whose failure mode is
            // otherwise totally silent (a message posted to the wrong/
            // mismatched origin, or one that arrives here but gets
            // rejected by either check below, produces no error anywhere).
            // Pairs with the wizard-side console.log in its own
            // sendToCompanion().
            if (event.origin !== WIZARD_ORIGIN) {
                // Expected/frequent no-op: this listener also sees every
                // OTHER cross-document message the page receives (e.g.
                // other extensions/iframes), not just the wizard's -- only
                // log this one at a lower level so it doesn't look like a
                // real problem on every unrelated message.
                console.debug(
                    "[webinstaller] ignoring message from unexpected origin",
                    event.origin,
                    "(expected",
                    WIZARD_ORIGIN,
                    ")"
                );
                return;
            }
            if (isFluidNCWizardReadyMessage(event.data)) {
                // The wizard tab has finished booting (loaded its own
                // schema/role data) and is now able to accept a config to
                // seed its editor with -- hand over whatever's currently
                // open here, if anything. `event.source` is the actual
                // window that sent this (most robust -- works even if our
                // own wizardWindowRef somehow went stale), falling back to
                // the ref only if that's for some reason unavailable.
                const target =
                    (event.source as Window | null) ?? wizardWindowRef.current;
                if (!target || !valueRef.current.trim()) {
                    console.log(
                        "[webinstaller] wizard ready, but nothing to send",
                        {
                            hasTarget: !!target,
                            hasValue: !!valueRef.current.trim()
                        }
                    );
                    return;
                }
                console.log(
                    "[webinstaller] wizard ready -- sending current config"
                );
                target.postMessage(
                    {
                        type: "fluidnc-config",
                        version: 1,
                        filename: fileRef.current?.name ?? "config.yaml",
                        contents: valueRef.current
                    },
                    WIZARD_ORIGIN
                );
                return;
            }
            if (!isFluidNCConfigMessage(event.data)) {
                console.warn(
                    "[webinstaller] message from wizard origin didn't match expected shape",
                    event.data
                );
                return;
            }
            console.log(
                "[webinstaller] received config from wizard:",
                event.data.filename
            );
            // Best-effort: try to bring this tab to the front so the user
            // doesn't have to manually switch back after clicking "Send to
            // WebInstaller" over in the wizard. Belt-and-suspenders with
            // the wizard's own `w.focus()` in its sendToCompanion() (which
            // targets window.opener, i.e. this tab, from directly within
            // its button's click handler -- the classic allowed case for
            // popup-return-to-opener focus): browsers vary on whether a
            // page can programmatically focus itself from a message-event
            // handler that wasn't itself triggered by a gesture IN THIS
            // tab, so this may silently no-op in some browsers/tab
            // arrangements (e.g. tabs pinned to different windows/
            // monitors) -- wrapped in try/catch since it's cosmetic, never
            // worth failing the actual config update over.
            try {
                window.focus();
            } catch (_e) {
                /* non-fatal -- see comment above */
            }
            setValue(event.data.contents);
            setHasErrors(false);
            setReceivedFromWizard(true);
            // Auto-hides rather than being cleared by Configuration's own
            // onChange: that callback also fires (with this exact same
            // value) the moment `value` changes and Configuration's
            // internal useEffect re-parses it, which would otherwise
            // immediately race the flag back to false before the user
            // ever sees the confirmation.
            setTimeout(() => setReceivedFromWizard(false), 4000);
        };
        window.addEventListener("message", onMessage);
        return () => window.removeEventListener("message", onMessage);
    }, []);

    const onOpenWizard = () => {
        setReceivedFromWizard(false);
        wizardWindowRef.current = openWizard();
    };

    const onSaveAs = (filename: string) => {
        setIsSaving(true);
        setShowSaveAs(false);
        onSave(
            {
                id: "",
                name: filename,
                size: 0
            },
            Buffer.from(value)
        )
            .then(() => onClose())
            .finally(() => {
                setIsSaving(false);
            });
    };

    return (
        <>
            {showSaveAs && (
                <CreateFileModal
                    show={true}
                    defaultFilename={generateNewFileName(
                        file ? [file] : [],
                        file?.name ?? "config.yaml"
                    )}
                    onCreate={(filename) => onSaveAs(filename)}
                    onCancel={() => setShowSaveAs(false)}
                    createNew={false}
                />
            )}
            <Modal show={!!file} size="xl" scrollable={true} centered={false}>
                <Modal.Header
                    style={{
                        paddingBottom: "0px",
                        paddingLeft: "0px",
                        paddingRight: "0px",
                        borderBottomStyle: "none"
                    }}
                >
                    <ConfigurationTabs
                        currentTab={tab}
                        onChange={setTab}
                        style={{ width: "100%" }}
                        hasErrors={hasErrors}
                    />
                </Modal.Header>
                <Modal.Body style={{ padding: "0px" }}>
                    {receivedFromWizard && (
                        <AlertMessage
                            variant="info"
                            style={{ margin: "16px", marginBottom: "0px" }}
                        >
                            Configuration received from the config wizard.
                        </AlertMessage>
                    )}
                    <Configuration
                        currentTab={tab}
                        value={value}
                        onClose={() => {}}
                        onChange={(value, hasError) => {
                            setValue(value);
                            setHasErrors(hasError ?? false);
                            if (hasError) {
                                setTab(ConfigurationTab.SOURCE);
                            }
                        }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button disabled={isSaving} onClick={onOpenWizard}>
                        <>
                            <FontAwesomeIcon
                                icon={faExternalLink as IconDefinition}
                                style={{ marginRight: "8px" }}
                            />
                            Open in Wizard
                        </>
                    </Button>
                    <Button disabled={isSaving} onClick={onClose}>
                        <>
                            <FontAwesomeIcon icon={faClose as IconDefinition} />{" "}
                            Close
                        </>
                    </Button>
                    {!createNew && (
                        <Button
                            disabled={isSaving}
                            buttonType={ButtonType.WARNING}
                            onClick={() => setShowSaveAs(true)}
                        >
                            <>
                                <FontAwesomeIcon
                                    icon={faSave as IconDefinition}
                                    style={{ marginRight: "8px" }}
                                />{" "}
                                Save as...
                            </>
                        </Button>
                    )}
                    <Button
                        disabled={isSaving || hasErrors}
                        buttonType={"btn-success"}
                        onClick={() => {
                            setIsSaving(true);
                            onSave(file!, Buffer.from(value))
                                .then(() => onClose())
                                .finally(() => {
                                    setIsSaving(false);
                                });
                        }}
                    >
                        <>
                            {!isSaving && (
                                <FontAwesomeIcon
                                    icon={faSave as IconDefinition}
                                    style={{ marginRight: "8px" }}
                                />
                            )}
                            {isSaving && <Spinner />}
                            Save
                        </>
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ConfigurationModal;
