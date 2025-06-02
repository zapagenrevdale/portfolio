import { create } from "zustand";

type VimModes = "NORMAL" | "VISUAL" | "INSERT";

type NvimStore = {
  group: string;
  mode: VimModes;
  setGroup: (val: string) => void;
  setMode: (val: VimModes) => void;
};

export const useNvimStore = create<NvimStore>((set) => ({
  group: "home",
  mode: "NORMAL",
  setGroup: (val: string) => set(() => ({ group: val })),
  setMode: (val: VimModes) => set(() => ({ mode: val })),
}));
