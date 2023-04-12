import create from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import storage from "./storage";

type ClockinState = {
  /** YYYY-MM-DD */
  dates: string[];
  setDates: (dates: ClockinState["dates"]) => void;
  clockIn: (date: string) => void;
};

export const useClockIn = create<
  ClockinState,
  [["zustand/persist", ClockinState]]
>(
  persist(
    (set) => ({
      dates: [],
      setDates: (dates) => set(() => {
        return { dates };
      }),
      clockIn: (date) => set((state) => {
        return {
          dates: state.dates.concat([date])
        };
      })
    }),
    {
      name: "clockin",
      storage: createJSONStorage(() => storage),
    }
  )
);
