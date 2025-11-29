import { create } from "zustand";
import { Stats } from "../services/controllerservice/commands/GetStatsCommand";

type Store = {
    stats: Stats;
    setStats: (stats: Stats) => void;
    version: string;
    setVersion: (version: string) => void;
};

const useControllerState = create<Store>((set) => ({
    stats: {},
    setStats: (stats) => set({ stats }),
    version: "?",
    setVersion: (version) => set({ version })
}));

export default useControllerState;
