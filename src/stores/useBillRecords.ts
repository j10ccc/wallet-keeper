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
  persist(set => ({
    list: [],
    addItem: (item) => set(state => ({
    // TODO: insert in order by date
      list: [...state.list, item]
    })),
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

