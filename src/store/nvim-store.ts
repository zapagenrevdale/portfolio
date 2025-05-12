import { create } from 'zustand'

type VimModes = "NORMAL" | "VISUAL" | "INSERT";

type NvimStore = {
  enabled: boolean;
  mode: VimModes;
  setEnabled: (val: boolean) => void;
  setMode: (val: VimModes) => void;
}

export const useNvimStore = create<NvimStore>((set) => ({
  enabled: true,
  setEnabled: (val: boolean) => set(() => ({ enabled: val })),
  mode: "NORMAL",
  setMode: (val: VimModes) => set(() => ({ mode: val }))
}))
