import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

/**
  * Find available range of month in indexList.
  */
const addressMonthIndex = (
  indexList: BillAPI.DateIndex[],
  startDate: Dayjs,
  endDate: Dayjs
) => {
  let startIndex = -1;
  let endIndex = -1;
  indexList.find((item, index)=> {
    if (dayjs(item.date).isBefore(startDate, "month")) {
      return true;
    } else if (!dayjs(item.date).isAfter(endDate, "month")) {
      startIndex = index;
    }
  });

  if (startIndex !== -1) {
    console.log(indexList.slice(startIndex));
    indexList.slice(0, startIndex + 1).find((item, index) => {
      if (!dayjs(item.date).isAfter(endDate, "month")) {
        endIndex = index;
        return true;
      }
    });

    // 处理最前面的空数据月份
    let startTmp = startIndex;
    indexList.slice(endIndex, startIndex + 1).reverse().find(item => {
      if (item.length !== 0) return true;
      startTmp--;
    });
    startIndex = startTmp;
    if (startIndex < endIndex) {
      startIndex = -1;
      endIndex = -1;
    }
  }

  return {
    monthStartIndex: startIndex,
    monthEndIndex: endIndex
  };
};

/**
  * Get range of record according to date range.
  *
  * Firstly find two edge month index from indexList,
  * and get the rough range record range,
  * then adjust to a exactly range.
  */
const addressRecordIndex = (
  indexList: BillAPI.DateIndex[],
  records: BillAPI.BillRecord[],
  startDate: Dayjs,
  endDate: Dayjs
) => {

  const { monthStartIndex, monthEndIndex } = addressMonthIndex(indexList, startDate, endDate);

  // roughly
  let startIndex = -1;
  let endIndex = -1;

  if(monthStartIndex !== -1 && monthEndIndex !== -1) {

    startIndex = indexList[monthStartIndex].index + indexList[monthStartIndex].length - 1;
    endIndex = indexList[monthEndIndex].index;

    // adjust
    records.slice(endIndex, startIndex + 1).find(item => {
      if (dayjs(item.date).isAfter(endDate, "day")) endIndex++;
      else return true;
    });
    records.slice(endIndex, startIndex + 1).reverse().find(item => {
      if (dayjs(item.date).isBefore(startDate, "day")) startIndex--;
    });
  }

  return {
    startIndex,
    endIndex
  };
};

export default {
  addressMonthIndex,
  addressRecordIndex,
};
