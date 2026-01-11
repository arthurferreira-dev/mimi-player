import { create } from "zustand";

type useMutedType = {
  muted: boolean;
  setMuted: () => void;
};

export const useMuted = create<useMutedType>((set) => ({
  muted: false,
  setMuted: () => set((state) => ({ muted: !state.muted })),
}));