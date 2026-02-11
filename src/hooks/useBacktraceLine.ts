import { useContext } from "react";
import { CapturedBacktraceContext } from "../context/CapturedBacktraceContext";

/**
 * Hook to retrieve the backtrace context including detected release and variant
 * The reader is registered at a higher level (FluidNCOutlet) to be always active
 */
export const useBacktraceLine = () => {
    const context = useContext(CapturedBacktraceContext);
    if (!context) {
        console.warn(
            "useBacktraceLine: CapturedBacktraceContext not available"
        );
        return {
            backtraceLine: "",
            detectedRelease: "",
            detectedVariant: ""
        };
    }
    return {
        backtraceLine: context.backtraceLine,
        detectedRelease: context.detectedRelease,
        detectedVariant: context.detectedVariant
    };
};

export default useBacktraceLine;
