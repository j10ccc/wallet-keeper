import create from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import storage from "./storage";

type QueryBillsState = {
  date: { year: number; month: number };
  type: "default" | "income" | "expense";
  ledgerID: number | undefined;
  setDate: (year: number, month: number) => void;
  setType: (type: string) => void;
  setLedgerID: (id: number) => void;
};

export const useQueryBills = create<
  QueryBillsState,
  [["zustand/persist", QueryBillsState]]
>(persist(
  (set) => {
    return {
      date: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
      },
      type: "default",
      ledgerID: undefined,
      setDate: (year, month) =>
        set(() => ({
          date: { year, month },
        })),
      setType: (value) =>
        set(() => ({
          type: value as QueryBillsState["type"],
        })),
      setLedgerID: (value) =>
        set(() => ({
          ledgerID: value,
        })),
    };
  },
  {
    name: "queryBills",
    storage: createJSONStorage(() => storage),
  }
),
);
