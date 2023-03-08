import PageView from "@/components/PageView";
import { useBillRecords } from "@/stores/useBillRecords";
import { ScrollView, View } from "@tarojs/components";
import { useEffect, useState } from "react";
import DateSelectorBar from "./DateSelectorBar";
import ExpenseSumChart from "./ExpenseSumChart";

import styles from "./index.module.scss";
import KindChart from "./KindChart";

const StatisticsPage = () => {
  // TODO: monthly statistics
  // TODO: yearly statistics
  const [date, setDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });

  const { list, indexList } = useBillRecords();
  const [monthlyData, setMonthlyData] = useState<BillAPI.BillRecord[]>([]);

  useEffect(() => {
    setMonthlyData(state => {
      state = [];
      const tracker = indexList.find(item =>
        item.date === `${date.year}-${date.month}`
      );
      if (tracker) {
        list.slice(tracker.index, tracker.length + tracker.index)
          .filter(item => item.type === "expense")
          .forEach(item => {
            state.push(item);
          });
      }
      return [...state];
    });
  }, [list, date]);

  const handleDateSelect = (e: {
    value: { year: number, month: number}
  } ) => {
    setDate(e.value);
  };

  return (
    <PageView>
      <DateSelectorBar initialValue={date} onSelect={handleDateSelect} />
      <ScrollView scrollY className={styles["scroll-view"]}>
        <View className={styles.container}>
          { monthlyData.length ?
            <>
              <ExpenseSumChart
                data={monthlyData}
                month={date.month}
                year={date.year}
              />
              <KindChart data={monthlyData} />
            </> : null
          }
        </View>
      </ScrollView>
    </PageView>
  );
};

export default StatisticsPage;
