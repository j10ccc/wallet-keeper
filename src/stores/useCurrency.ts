import create from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import storage from "./storage";

type CurrencyState = {
  value: number;
  overwrite: (value: number) => void;
  plus: (value: number ) => void;
};

export const useCurrecy = create<
  CurrencyState,
  [["zustand/persist", CurrencyState]]
>(
  persist(
    (set) => ({
      value: 239,
      overwrite: (value) => set(() => ({
        value: value
      })),
      plus: (value) => set(state => ({
        value: state.value + value
      })),
    }),
    {
      name: "currency",
      storage: createJSONStorage(() => storage),
    }
  )
);
