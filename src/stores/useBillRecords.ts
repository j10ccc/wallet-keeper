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
      const [YEAR, MONTH, DAY] = date.split("-");
      const list = get().list;
      let index = list.findIndex(item => {
        const [year, month, day] = item.date.split("-");
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
        state.list.splice(index, 1);
        return state;
      });
      return isFound;
    },
    replaceItem: (uid: string, item) => set(state => {
      state.removeItem(uid);
      state.addItem({ uid, ...item});
      return state;
    })
  }),
  {
    name: "billRecords",
    storage: createJSONStorage(() => storage)
  })
);

