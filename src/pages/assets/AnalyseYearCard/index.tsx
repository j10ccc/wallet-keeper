import { useBillRecords } from "@/stores/useBillRecords";
import { View, Text } from "@tarojs/components";
import { useState, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import dayjs from "dayjs";
import classNames from "classnames";
import { MonthChars } from "@/constants/DateChars";
import RecordUtils from "@/utils/RecordUtils";
import DayUtils from "@/utils/DayUtils";

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
  const today = DayUtils.getToday();
  const startDate = useRef(DayUtils.getThisWeekStartTime().subtract(11, "week"));
  const endDate = useRef(DayUtils.getThisWeekEndTime());

  const todayIndex = useRef(
    chartSize.current.width * chartSize.current.height -
      1 +
      today.startOf("day").diff(endDate.current, "day")
  );

  // TODO: change initial rules
  const [data, setData] = useState<ChartDataType[]>([]);

  const [monthLabels, setMonthLabels] = useState<MonthLabelType[]>([]);

  useEffect(() => {
    if (!indexList?.length) return;

    const { startIndex: recordStartIndex, endIndex: recordEndIndex  } =
      RecordUtils.addressRecordIndex(
        indexList,
        records,
        startDate.current,
        endDate.current
      );

    /** 热力图每个点的数据 */
    const dataTmp: typeof data = new Array(
      chartSize.current.height * chartSize.current.width
    ).fill(0).map(() => ({ value: 0 }));

    records.slice(recordEndIndex, recordStartIndex + 1).forEach((item) => {
      const diff = endDate.current.diff(dayjs(item.date), "day");
      dataTmp[chartSize.current.height * chartSize.current.width - 1 - diff]
        .value++;
    });
    setData(dataTmp);
  }, [records]);

  useEffect(() => {
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
              <Text
                key={`${item.label}-content`}
                className={styles.month}
                style={{
                  flex: `0 calc(100% / ${chartSize.current.width} * ${item.columns})`,
                }}
              >
                {item.label}
              </Text>
            );
          })}
        </View>
      </View>
      <View className={styles["statistic-info"]}>
        <View className={styles.item}>
          <Text className={styles.title}>连续记账天数</Text>
          <Text className={styles.value}>
            {[...data].reverse().findIndex((item) => !(item.value > 0))}
          </Text>
        </View>
        <View className={styles.item}>
          <Text className={styles.title}>近三月累计记账</Text>
          <Text className={styles.value}>
            {data.reduce((prev, curr) => curr.value + prev, 0)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AnalyseYearCard;
