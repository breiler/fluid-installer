import { create } from "zustand";

type Store = {
    isConnected: boolean;
    setIsConnected: (connected: boolean) => void;
    showPopupTerminal: boolean;
    setShowPopupTerminal: (show: boolean) => void;
};

const usePopupTerminalStore = create<Store>((set) => ({
    isConnected: false,
    setIsConnected: (isConnected) => set({ isConnected }),

    showPopupTerminal: false,
    setShowPopupTerminal: (showPopupTerminal) => set({ showPopupTerminal })
}));

export default usePopupTerminalStore;
