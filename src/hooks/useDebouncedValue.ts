import { useEffect, useState } from "react";

export const useDebouncedValue = (value: string, delayMs: number): string => {
    const [debouncedValue, setDebouncedValue] = useState<string>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delayMs);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delayMs]);

    return debouncedValue;
};
