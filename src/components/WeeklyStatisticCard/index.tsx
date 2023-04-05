import { useBillRecords } from "@/stores/useBillRecords";
import { Canvas, Chart, Interval, Axis, TextGuide } from "@antv/f2";
import { View, Text } from "@tarojs/components";
import F2 from "../F2";
import { memo, useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import dayjs from "dayjs";
import { Weekdays } from "@/constants/Weekdays";
// import { useQueryBills } from "@/stores/useQueryBills";

type ChartDataType = {
  value: number;
  weekday: string;
  type: string;
};

const WeeklyStatisticCard = () => {
  const records = useBillRecords((store) => store.list);
  // TODO: trigger render by selected queryType
  // const queryType = useQueryBills((store) => store.type);
  const [queryType] = useState<"default" | "expense" | "income">("default");
  const incomeData = useRef<ChartDataType[]>([]);
  const expenseData = useRef<ChartDataType[]>([]);

  const [data, setData] = useState<Array<ChartDataType>>([]);

  useEffect(() => {
    const daysAgoDate = dayjs().subtract(((dayjs().day() + 6) % 7) + 1, "day");
    const index = records.findIndex(
      (item) => !dayjs(item.date).isAfter(daysAgoDate, "day")
    );
    incomeData.current = Weekdays.map((item) => ({
      type: "income",
      weekday: item,
      value: 0,
    }));
    expenseData.current = Weekdays.map((item) => ({
      type: "expense",
      weekday: item,
      value: 0,
    }));

    records.slice(0, index).forEach((item) => {
      const weekdayIndex = dayjs(item.date).day() || 7;
      if (item.type === "income")
        incomeData.current[weekdayIndex - 1].value += item.value;
      else expenseData.current[weekdayIndex - 1].value += item.value;
    });
    setDataByQueryType();
  }, [records]);

  useEffect(() => {
    setDataByQueryType();
  }, [queryType]);

  const setDataByQueryType = () => {
    setData(() => {
      if (queryType === "expense") {
        return expenseData.current;
      } else if (queryType === "income") {
        return incomeData.current;
      } else {
        return [...expenseData.current, ...incomeData.current];
      }
    });
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <View className={styles.title}>
          <Text className={styles.main}>
            本周
            {queryType === "default" && "记账"}
            {queryType === "income" && "收入"}
            {queryType === "expense" && "支出"}
          </Text>
          <View className={styles.sub}>
            <Text>共计: </Text>
            <Text className={styles.expense}>
              -
              {data
                .reduce(
                  (prev, curr) =>
                    prev + (curr.type === "expense" ? curr.value : 0),
                  0
                )
                .toFixed(2)}
            </Text>
            <Text className={styles.income}>
              +
              {data
                .reduce(
                  (prev, curr) =>
                    prev + (curr.type === "income" ? curr.value : 0),
                  0
                )
                .toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
      <View className={styles.body}>
        <View className={styles.chart}>
          <F2 chartId="weekly-statistic">
            <Canvas>
              <Chart data={data}>
                <Axis field="weekday" />
                <Interval
                  x="weekday"
                  y="value"
                  adjust="dodge"
                  color={{
                    field: "type",
                    callback: (val: string) =>
                      val === "expense" ? "#29cf74aa" : "#e2ad49aa",
                  }}
                  style={{
                    field: "value",
                    radius: (val: number) =>
                      val > 0 ? [8, 8, 0, 0] : [0, 0, 8, 8],
                    lineWidth: 12,
                    alignItems: "center",
                  }}
                />
                {data.map(
                  (item) =>
                    item.value && (
                      <TextGuide
                        key={`${item.weekday}-${item.type}`}
                        records={[item]}
                        adjust="dodge"
                        style={{
                          fill: item.type === "expense" ? "#29cf74" : "#e2ad49",
                        }}
                        content={item.value.toFixed(
                          queryType === "default" ? 0 : 2
                        )}
                        offsetY={item.value > 0 ? -10 : 10}
                        offsetX={item.type === "expense" ? -20 : 5}
                      />
                    )
                )}
              </Chart>
            </Canvas>
          </F2>
        </View>
      </View>
    </View>
  );
};

export default memo(WeeklyStatisticCard);
