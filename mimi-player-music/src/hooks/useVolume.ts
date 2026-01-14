import { create } from "zustand";

type useVolumeType = {
  vol: number;
  setVol: (volume: number) => void;
};

export const useVolume = create<useVolumeType>((set) => ({
  vol: 1.0,
  setVol: (volume: number) => set({ vol: volume }),
}));