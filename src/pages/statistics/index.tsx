import { useBillRecords } from "@/stores/useBillRecords";
import { ScrollView } from "@tarojs/components";
import { useEffect, useState } from "react";
import ExpenseSumChart from "./ExpenseSumChart";

import styles from "./index.module.scss";

const StatisticsPage = () => {
  // TODO: monthly statistics
  // TODO: yearly statistics
  const date = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  };

  const { list, indexList } = useBillRecords();
  const [monthlyData, setMonthlyData] = useState<BillAPI.BillRecord[]>([]);

  useEffect(() => {
    setMonthlyData(state => {
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
  }, [list]);

  return (
    <ScrollView enableFlex className={styles["scroll-view"]}>
      <ExpenseSumChart
        data={monthlyData}
        month={date.month}
        year={date.year}
      />
    </ScrollView>
  );
};

export default StatisticsPage;
