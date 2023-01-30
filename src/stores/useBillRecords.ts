import { createJSONStorage, persist } from "zustand/middleware";
import create from "zustand";
import storage from "./storage";

type BillRecordsState = {
  list: Bill.BillRecord[]
  addItem: (item: Bill.BillRecord) => void;
  removeItem: (uid: string) => boolean;
  replaceItem: (uid: string, value: Omit<Bill.BillRecord, "uid">) => void;
}

export const useBillRecords = create<
  BillRecordsState,
  [["zustand/persist", BillRecordsState]]
>(
  persist((set, get) => ({
    list: [],
    addItem: (item) => {
      const date = item.date;
      const [YEAR, MONTH, DAY] = date.split("-").map(item => parseInt(item));
      const list = get().list;
      let index = list.findIndex(item => {
        const [year, month, day] = item.date.split("-").map(item => parseInt(item));
        if (year <= YEAR && month <= MONTH && day <= DAY)
          return true;
      });
      if (index === -1) index = list.length;
      return set(state => ({
        list: [...state.list.slice(0, index), item, ...state.list.slice(index)]
      }));
    },
    removeItem: (uid) => {
      let isFound = false;
      set(state => {
        const index = state.list.findIndex(item => uid === item.uid);
        if (index !== -1) isFound = true;
        return {
          list: [...state.list.slice(0, index), ...state.list.slice(index + 1)]
        };
      });
      return isFound;
    },
    replaceItem: (uid: string, item) => {
      get().removeItem(uid);
      get().addItem({ uid, ...item });
    },
  }),
  {
    name: "billRecords",
    storage: createJSONStorage(() => storage)
  })
);

