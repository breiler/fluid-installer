import { Offcanvas } from "react-bootstrap";
import usePopupTerminalStore from "../../store/PopupTerminalStore";
import React from "react";
import { TerminalComponent } from "../terminalcomponent/TerminalComponent";

export const TerminalPopup = () => {
    const { showPopupTerminal, setShowPopupTerminal } = usePopupTerminalStore();

    return (
        <Offcanvas
            show={showPopupTerminal}
            onHide={() => setShowPopupTerminal(false)}
            placement="bottom"
            backdrop={false}
            scroll={true}
            style={{
                width: "580px",
                height: "460px",
                position: "fixed",
                bottom: 0,
                right: 0,
                left: "auto",
                transform: "none",
                borderTopLeftRadius: "8px",
                background: "#0d6efd"
            }}
        >
            <Offcanvas.Header closeButton />
            <Offcanvas.Body style={{ padding: 0 }}>
                <TerminalComponent />
            </Offcanvas.Body>
        </Offcanvas>
    );
};
