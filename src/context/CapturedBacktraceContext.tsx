import React, { createContext, useState, ReactNode } from "react";

interface CapturedBacktraceContextType {
    backtraceLine: string;
    setBacktraceLine: (line: string) => void;
    detectedRelease: string;
    setDetectedRelease: (release: string) => void;
    detectedVariant: string;
    setDetectedVariant: (variant: string) => void;
}

export const CapturedBacktraceContext = createContext<
    CapturedBacktraceContextType | undefined
>(undefined);

export const CapturedBacktraceProvider: React.FC<{ children: ReactNode }> = ({
    children
}) => {
    const [backtraceLine, setBacktraceLine] = useState<string>("");
    const [detectedRelease, setDetectedRelease] = useState<string>("");
    const [detectedVariant, setDetectedVariant] = useState<string>("");

    return (
        <CapturedBacktraceContext.Provider
            value={{
                backtraceLine,
                setBacktraceLine,
                detectedRelease,
                setDetectedRelease,
                detectedVariant,
                setDetectedVariant
            }}
        >
            {children}
        </CapturedBacktraceContext.Provider>
    );
};

export default CapturedBacktraceContext;
