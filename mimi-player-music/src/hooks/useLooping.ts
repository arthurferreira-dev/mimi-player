import { create } from "zustand";

type useLoopingType = {
  loop: boolean;
  setLoop: () => void;
};

export const useLooping = create<useLoopingType>((set) => ({
  loop: false,
  setLoop: () => set((state) => ({ loop: !state.loop })),
}));