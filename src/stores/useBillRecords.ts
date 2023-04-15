import { createJSONStorage, persist } from "zustand/middleware";
import create from "zustand";
import storage from "./storage";

type BillRecordsState = {
  list: BillAPI.BillRecord[];
  // TODO: handle retry
  unsyncList: Array<BillAPI.BillRecord & { operateTye: string }>;
  indexList: Array<BillAPI.DateIndex>;
  addItem: (item: BillAPI.BillRecord) => void;
  removeItem: (uid: string) => boolean;
  removeByLedger: (ledgerId: number) => void;
  updateItem: (uid: string, value: Omit<BillAPI.BillRecord, "uid">) => void;
  updateIndex: (records: Array<BillAPI.BillRecord>, type?: "add" | "delete") => void;
}

export const useBillRecords = create<
  BillRecordsState,
  [["zustand/persist", BillRecordsState]]
>(
  persist((set, get) => ({
    list: [],
    unsyncList: [],
    indexList: [],
    addItem: (item) => {
      get().updateIndex([item]);
      const date = item.date;
      const [YEAR, MONTH, DAY] = date.split("-").map(item => parseInt(item));
      const list = get().list;
      let index = list.findIndex(item => {
        const [year, month, day] = item.date.split("-").map(item => parseInt(item));
        if (year < YEAR) {
          return true;
        } else if (year === YEAR && month < MONTH) {
          return true;
        } else if (month === MONTH && day < DAY)
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
        if (index !== -1){
          state.updateIndex([state.list[index]], "delete");
          isFound = true;
        }
        return {
          list: [...state.list.slice(0, index), ...state.list.slice(index + 1)]
        };
      });
      return isFound;
    },
    removeByLedger: (ledgerId) => {
      set(state => {
        const toDelete: BillAPI.BillRecord[] = [];
        const res = state.list.filter(item => {
          if (item.ledgerID !== ledgerId) return true;
          else toDelete.push(item);
        });
        state.updateIndex(toDelete, "delete");
        return {
          list: res
        };
      });
    },
    updateItem: (uid: string, item) => {
      get().removeItem(uid);
      get().addItem({ uid, ...item });
    },
    updateIndex: (records, type = "add") => {
      // 计算出日期集合
      /** e.g. { "2021-03-24": 5 } */
      const dateLengthMap = {};
      records.forEach(item => {
        if (!dateLengthMap[item.date])
          dateLengthMap[item.date] = 0;
        dateLengthMap[item.date] ++;
      });

      // 按日期逐个更新
      Object.keys(dateLengthMap).forEach(date => {
        // 找到要插入的位置
        const [YEAR, MONTH] = date
          .slice(0, date.lastIndexOf("-"))
          .split("-")
          .map(item => parseInt(item));
        set(state => {
          const total = dateLengthMap[date];
          let indexList = state.indexList;
          let index = indexList.findIndex(item => {
            const [year, month] = item.date.split("-").map(item => parseInt(item));
            if (year < YEAR) {
              return true;
            } else if (year === YEAR && month < MONTH) {
              return true;
            }
          });

          if (index === -1) index = indexList.length;
          if (indexList[index - 1]?.date !== `${YEAR}-${MONTH}`) {
            // initialize
            indexList = [...state.indexList.slice(0, index), {
              date: `${YEAR}-${MONTH}`,
              // 取前一个的 尾部地址
              index: (indexList[index - 1]?.index || 0) + (indexList[index - 1]?.length || 0),
              length: 0
            }, ...state.indexList.slice(index)];
            index++;
          }

          // 执行修改
          if (type === "add") {
            if (index - 1 >= 0) indexList[index - 1].length += total;
            for (let i = index; i < indexList.length; i++)
              if (indexList[i].index !== undefined) indexList[i].index! += total;
          }
          else {
            if (index - 1 >= 0) indexList[index - 1].length -= total;
            for (let i = index; i < indexList.length; i++)
              if (indexList[i].index !== undefined) indexList[i].index! -= total;
          }
          return ({ indexList });
        });
      });
    }
  }),
  {
    name: "billRecords",
    storage: createJSONStorage(() => storage)
  })
);
