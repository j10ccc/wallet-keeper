import { useBillRecords } from "@/stores/useBillRecords";
import { View, Text } from "@tarojs/components";
import { useState, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import dayjs from "dayjs";
import classNames from "classnames";
import { MonthChars } from "@/constants/DateChars";

type ChartDataType = {
  /** 当日记账次数 */
  value: number;
};

type MonthLabelType = {
  label: string;
  columns: number;
};

const AnalyseYearCard = () => {
  const chartSize = useRef({
    width: 12,
    height: 7,
  });

  const { list: records, indexList } = useBillRecords();
  const todayIndex = useRef(
    chartSize.current.width * chartSize.current.height -
      1 +
      dayjs()
        .startOf("day")
        .diff(dayjs().locale("zh-cn").startOf("week").day(7), "day")
  );

  const startDate = useRef(
    dayjs().locale("zh-cn").startOf("week").day(1).subtract(11, "week")
  );
  const endDate = useRef(dayjs().locale("zh-cn").startOf("week").day(7));

  const [data, setData] = useState<ChartDataType[]>(
    new Array(chartSize.current.width * chartSize.current.height)
      .fill(0)
      .map(() => ({ value: 0 }))
  );

  const [monthLabels, setMonthLabels] = useState<MonthLabelType[]>([]);

  useEffect(() => {
    // TODO: handle with empty indexList case
    if (!indexList?.length) return;

    let startIndex = indexList.findIndex((item) =>
      dayjs(item.date).isBefore(startDate.current, "day")
    );
    if (startIndex === -1) {
      startIndex = indexList.length - 1;
    }

    let endIndex = indexList.findIndex((item) =>
      dayjs(item.date).isBefore(endDate.current, "day")
    );
    if (endIndex === -1) {
      endIndex = indexList.length - 1;
    }

    let recordEndIndex = records
      .slice(
        indexList[endIndex].index,
        indexList[endIndex].index + indexList[endIndex].length
      )
      .findIndex((item) => !dayjs(item.date).isAfter(endDate.current, "day"));
    if (recordEndIndex === -1) {
      recordEndIndex =
        indexList[endIndex].index + indexList[endIndex].length - 1;
    } else {
      recordEndIndex = indexList[endIndex].index + recordEndIndex;
    }

    let recordStartIndex = records
      .slice(
        indexList[startIndex].index,
        indexList[startIndex].index + indexList[startIndex].length
      )
      .findIndex((item) => !dayjs(item.date).isAfter(startDate.current, "day"));
    if (recordStartIndex === -1) {
      recordStartIndex =
        indexList[startIndex].index + indexList[startIndex].length - 1;
    } else {
      recordStartIndex = indexList[startIndex].index + recordStartIndex;
    }

    const dataTmp: typeof data = new Array(
      chartSize.current.height * chartSize.current.width
    )
      .fill(0)
      .map(() => ({ value: 0 }));
    records.slice(recordEndIndex, recordStartIndex + 1).forEach((item) => {
      const diff = endDate.current.diff(dayjs(item.date), "day");
      dataTmp[chartSize.current.height * chartSize.current.width - 1 - diff]
        .value++;
    });
    setData(dataTmp);
  }, [records]);

  useEffect(() => {
    // TODO: handle with empty indexList case
    const monthLabelsData: typeof monthLabels = [];
    let startMonth = 0;
    for (let i = 0; i < chartSize.current.width; i++) {
      const month = startDate.current
        .add(i, "week")
        .locale("zh-cn")
        .startOf("week")
        .day(7)
        .month();
      if (i === 0) startMonth = month;
      if (!monthLabelsData[month - startMonth]) {
        monthLabelsData.push({ columns: 0, label: "一月" });
      }
      monthLabelsData[month - startMonth].columns++;
      monthLabelsData[month - startMonth].label = MonthChars[month];
    }
    setMonthLabels(monthLabelsData);
  }, []);

  return (
    <View className={styles.container}>
      <View className={styles.heatchart}>
        <View className={styles.grid}>
          {data.map((item, index) => (
            <View
              key={index}
              className={classNames([
                styles.item,
                item.value > 0 && item.value <= 3 && styles.light,
                item.value > 3 && item.value <= 8 && styles.normal,
                item.value > 9 && styles.dark,
                todayIndex.current === index && styles.today,
              ])}
            />
          ))}
        </View>
        <View className={styles.axis}>
          {monthLabels.map((item) => {
            return (
              <>
                <Text
                  key={`${item.label}-content`}
                  className={styles.month}
                  style={{
                    flex: `0 calc(100% / ${chartSize.current.width} * ${item.columns})`,
                  }}
                >
                  {item.label}
                </Text>
              </>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default AnalyseYearCard;
