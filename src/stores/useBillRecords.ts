import { createJSONStorage, persist } from "zustand/middleware";
import create from "zustand";
import storage from "./storage";

type BillRecordsState = {
  // list: Bill.BillRecord[]
  dataSet: {
    [key: string]: {
      [key: string]: Bill.BillRecord[]
    }
  },
  addItem: (item: Bill.BillRecord) => void;
  removeItem: (uid: string, date: string) => boolean;
  replaceItem: (uid: string, date: string, value: Omit<Bill.BillRecord, "uid">) => void;
}

export const useBillRecords = create<
  BillRecordsState,
  [["zustand/persist", BillRecordsState]]
>(
  persist(set => ({
    // list: [],
    dataSet: {},
    addItem: (item) => set(state => {
      const [year, month] = item.date.split("-");
      if (state.dataSet[year] === undefined)
        state.dataSet[year] = {};
      if (state.dataSet[year][month] === undefined)
        state.dataSet[year][month] = [];
      state.dataSet[year][month].push(item);

      return state;
    }),
    removeItem: (uid, date) => {
      let isFound = false;
      set(state => {
        const [year, month] = date.split("/");
        try {
          const index = state.dataSet[year][month].findIndex(
            item => uid === item.uid
          );
          if (index !== -1) {
            isFound = true;
            state.dataSet[year][month].splice(index, 0);
          }
        } catch(error) {
          console.log(error);
        }
        return state;
      });
      return isFound;
    },
    replaceItem: (uid, date, value) => {
      let isFound = false;
      set(state => {
        const [year, month] = date.split("/");
        try {
          const index = state.dataSet[year][month].findIndex(
            item => uid === item.uid
          );
          if (index !== -1) {
            isFound = true;
            state.dataSet[year][month][index] = {
              ...state.dataSet[year][month][index],
              ...value
            };
          }
        } catch(error) {
          console.log(error);
        }
        return state;
      });
      return isFound;
    },
  }),
  {
    name: "billRecords",
    storage: createJSONStorage(() => storage)
  })
);

