import create from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import storage from "./storage";

type LedgerState = {
  list: LedgerAPI.Ledger[];
  create: (data: LedgerAPI.Ledger) => void;
  update: (newData: LedgerAPI.Ledger) => void;
  delete: (id: number) => void;
  overwrite: (data: LedgerAPI.Ledger[]) => void;
};

export const useLedger = create<
  LedgerState,
  [["zustand/persist", LedgerState]]
>(
  persist(
    (set) => ({
      list: [],
      create: (data) => {
        set((state) => ({
          list: state.list.concat([data]),
        }));
      },
      update: (newData) => {
        set((state) => ({
          list: state.list.map((item) => {
            if (item.id === newData.id) return newData;
            else return item;
          }),
        }));
      },
      delete: (id) => {
        set((state) => ({
          list: state.list.filter((item) => item.id !== id),
        }));
      },
      overwrite: (data) => {
        set(() => ({
          list: data,
        }));
      },
    }),
    {
      name: "ledgers",
      storage: createJSONStorage(() => storage),
    }
  )
);
