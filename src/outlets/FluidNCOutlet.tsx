import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ControllerServiceContext } from "../context/ControllerServiceContext";
import {
    CapturedBacktraceContext,
    CapturedBacktraceProvider
} from "../context/CapturedBacktraceContext";
import LostConnectionModal from "../modals/lostconnectionmodal/LostConnectionModal";
import { ControllerService, ControllerStatus } from "../services";
import useControllerStatus from "../hooks/useControllerStatus";
import { SerialPort } from "../utils/serialport/SerialPort";
import { SerialPortContext } from "../context/SerialPortContext";
import { Col, Container, Row } from "react-bootstrap";
import Navigation from "../panels/navigation/Navigation";
import Connection from "../pages/fluidnc/connection/Connection";
import { TerminalPopup } from "../components/terminalpopup/TerminalPopup";
import usePopupTerminalStore from "../store/PopupTerminalStore";

const decoder = new TextDecoder();

// Inner component that uses the backtrace context
const FluidNCOutletInner = () => {
    const [controllerService, setControllerService] =
        useState<ControllerService>();
    const [serialPort, setSerialPort] = useState<SerialPort | undefined>();
    const { setIsConnected } = usePopupTerminalStore();
    const backtraceContext = React.useContext(CapturedBacktraceContext);

    const onCloseConnection = () => {
        setControllerService(undefined);
    };

    // React.Dispatch<React.SetStateAction<ControllerService>
    const setServices = (
        controllerService: ControllerService,
        serialPort: SerialPort
    ) => {
        setControllerService(controllerService);
        setSerialPort(serialPort);
    };

    const controllerStatus = useControllerStatus(controllerService);
    useEffect(() => {
        setIsConnected(controllerStatus !== ControllerStatus.DISCONNECTED);
    }, [controllerStatus]);

    // Register global backtrace reader
    useEffect(() => {
        if (!controllerService?.serialPort || !backtraceContext) return;

        console.log("FluidNCOutlet: Setting up global backtrace reader");

        let lineBuffer = "";
        const dataReader = (data: Buffer) => {
            lineBuffer += decoder.decode(data);

            // Process complete lines
            while (true) {
                const pos = lineBuffer.indexOf("\n");
                if (pos === -1) {
                    break;
                }

                const line = lineBuffer.substring(0, pos).replace(/\r/g, "");
                lineBuffer = lineBuffer.slice(pos + 1);

                // Check if this line contains a backtrace
                if (line && line.includes("Backtrace:")) {
                    console.log(
                        "FluidNCOutlet: Found line with Backtrace:",
                        line
                    );
                    const match = line.match(/Backtrace:\s*(.+)/i);
                    if (match && match[1]) {
                        let extractedTrace = match[1].trim();
                        // Remove trailing ']' if present
                        if (extractedTrace.endsWith("]")) {
                            extractedTrace = extractedTrace.slice(0, -1).trim();
                        }
                        // Only update if we got actual addresses (contains 0x)
                        if (extractedTrace.includes("0x")) {
                            console.log(
                                "FluidNCOutlet: Captured valid backtrace:",
                                extractedTrace
                            );
                            backtraceContext.setBacktraceLine(extractedTrace);
                        }
                    }
                }

                // Check if this line contains a FluidNC version
                if (line && line.includes("FluidNC")) {
                    console.log(
                        "FluidNCOutlet: Found line with FluidNC version:",
                        line
                    );
                    const versionMatch = line.match(
                        /FluidNC\s+(v[\d.a-zA-Z-]+)/i
                    );
                    if (versionMatch && versionMatch[1]) {
                        const detectedVersion = versionMatch[1];
                        console.log(
                            "FluidNCOutlet: Detected FluidNC version:",
                            detectedVersion
                        );
                        backtraceContext.setDetectedRelease(detectedVersion);
                    }

                    // Extract firmware variant from second parenthesized expression
                    const parentheses = line.match(/\([^)]+\)/g);
                    if (parentheses && parentheses.length >= 2) {
                        // Get the second parenthesized expression
                        const variantMatch =
                            parentheses[1].match(/\(([^)]+)\)/);
                        if (variantMatch && variantMatch[1]) {
                            const variant = variantMatch[1]
                                .toLowerCase()
                                .trim();
                            console.log(
                                "FluidNCOutlet: Detected firmware variant:",
                                variant
                            );
                            backtraceContext.setDetectedVariant(variant);
                        }
                    }
                }
            }
        };

        controllerService.serialPort.addReader(dataReader);

        return () => {
            console.log("FluidNCOutlet: Removing global backtrace reader");
            controllerService.serialPort.removeReader(dataReader);
        };
    }, [controllerService?.serialPort, backtraceContext]);

    if (
        !controllerService ||
        controllerStatus === ControllerStatus.DISCONNECTED
    ) {
        return <Connection onConnect={setServices} />;
    }

    return (
        <SerialPortContext.Provider value={serialPort}>
            <ControllerServiceContext.Provider value={controllerService}>
                <Container>
                    <Row>
                        <Col sm={5} md={4} lg={3}>
                            <Navigation />
                        </Col>
                        <Col sm={7} md={8} lg={9} style={{ marginTop: "32px" }}>
                            <LostConnectionModal onClose={onCloseConnection} />
                            <Outlet />
                        </Col>
                    </Row>
                </Container>
                <TerminalPopup />
            </ControllerServiceContext.Provider>
        </SerialPortContext.Provider>
    );
};

// Outer component that provides the backtrace context
const FluidNCOutlet = () => {
    return (
        <CapturedBacktraceProvider>
            <FluidNCOutletInner />
        </CapturedBacktraceProvider>
    );
};

export default FluidNCOutlet;
