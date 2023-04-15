import dayjs from "dayjs";
import { FetchItemsAPI } from "@/services/bill/FetchItemsAPI";
import { useGuid } from "@/hooks/useGuid";
import { omit } from "lodash-es";
import { addressRecordIndex } from "./address";

const TypeMap = {
  "income": 0,
  "expense": 1,
};

export const fetchRecords = async (
  time: string,
  timeType: "month" | "day" | "year",
  pageSize = 10,
  ledgerId: number,
  type?: "income" | "expense"
) => {
  let pageNum = 1;
  let arr: BillAPI.BillRecord[] = [];
  let currentResult : BillAPI.BillRecord[] = [];
  let requested = false;

  while (currentResult.length || !requested) {
    try {
      const res = await FetchItemsAPI({
        date: timeType === "day" ? time : "",
        month: timeType === "month" ? time : "",
        year: timeType === "year" ? time : "",
        page_size: pageSize,
        page_num: pageNum++,
        ledger_id: ledgerId,
        type: type ? TypeMap[type]: undefined
      });
      if (res.data.code === 200) {
        currentResult = (res.data.data.result.map(item => ({
          id: item.id,
          uid: useGuid().guid,
          date: dayjs(item.date).format("YYYY-M-D"),
          type: item.type ? "expense" : "income",
          value: item.value,
          ledgerID: ledgerId,
          remark: item.remark,
          kind: item.kind
        })));
      } else {
        throw new Error(res.data.msg);
      }
    } catch (e) {
      console.log(e);
    }
    arr = arr.concat(currentResult);
    requested = true;
  }

  return arr;
};

export const isEqual = (a: BillAPI.BillRecord, b: BillAPI.BillRecord) => {
  if (a.date !== b.date) return false;
  if (a.kind !== b.kind) return false;
  if (a.type !== b.type) return false;
  if (a.value !== b.value) return false;
  if (a.remark && !b.remark || !a.remark && b.remark) return false;
  if (a.remark && b.remark && a.remark !== b.remark) return false;
  return true;
};

export const diff = (remote: BillAPI.BillRecord[], store: BillAPI.BillRecord[]) => {
  const A: BillAPI.BillRecord[] = [];
  const D: BillAPI.BillRecord[] = [];
  const M: BillAPI.BillRecord[] = [];

  const leftMap: {
    [key: number]: BillAPI.BillRecord & { checked: boolean }
  } = {};

  remote.forEach(item => {
    leftMap[item.id!] = {
      ...item,
      checked: false
    };
  });

  store.forEach(item => {
    // TODO: handle unsettled id item
    // should not exist item without id
    if (!item.id) return;
    // store item is in the remote list
    if (leftMap[item.id]) {
      // compare
      const record = omit(leftMap[item.id], ["checked"]);
      if (!isEqual(item,leftMap[item.id])) {
        // TODO: item | record
        M.push(record);
      }
      leftMap[item.id].checked = true;
    } else {
      A.push(item);
    }
  });

  Object.values(leftMap).forEach(item =>
    !item.checked && D.push(omit(item, ["checked"]))
  );

  return {
    add: A,
    deleted: D,
    modified: M
  };

};

export const getMergeData = async (
  time: string,
  timeType: "year" | "month" | "day",
  ledgerID: number,
  indexList: BillAPI.DateIndex[],
  records: BillAPI.BillRecord[],
  requestSize = 10
) => {
  const queryDate = dayjs(time);
  const res = await fetchRecords(time, timeType, requestSize, ledgerID);
  const { startIndex, endIndex } = addressRecordIndex(
    indexList,
    records,
    queryDate.startOf(timeType),
    queryDate.endOf(timeType)
  );
  const diffRes = diff(res, records.slice(endIndex, startIndex + 1));
  // TODO: handle other array

  return diffRes.deleted;
};
