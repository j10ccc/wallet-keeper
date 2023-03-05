import MediaCard from "../../../components/MediaCard";
import { Text, View } from "@tarojs/components";

import styles from "./index.module.scss";
import { useBillRecords } from "@/stores/useBillRecords";
import classNames from "classnames";
import { useEffect, useState } from "react";

const AnalyseMonthCard = () => {
  // TOOD: nav to statistics page
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [countOfExpenseDots, setCountOfExpenseDots] = useState(0);
  const currentDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  };
  const { indexList, list } = useBillRecords();

  useEffect(() => {
    let expenseSum = 0;
    let incomeSum = 0;
    const tracker = indexList.find(item =>
      item.date === `${currentDate.year}-${currentDate.month}`
    );
    for (let i = 0; i < (tracker?.length || 0); i++) {
      if (list[i].type === "expense")
        expenseSum += list[i].value;
      else incomeSum += list[i].value;
    }
    setExpenseTotal(expenseSum);
    setIncomeTotal(incomeSum);
    console.log(expenseSum, incomeSum);
    setCountOfExpenseDots(Math.ceil(expenseSum / (incomeSum + expenseSum) * 20));
  }, [list]);

  return (
    <MediaCard title="本月收支">
      <View className={styles.container}>
        <View className={styles.main}>
          <View className={styles.col}>
            <Text className={styles.label}>支出</Text>
            <Text className={styles.value}>¥ {expenseTotal.toFixed(2)}</Text>
          </View>
          <View className={styles.col}>
            <Text className={styles.label}>收入</Text>
            <Text className={styles.value}>¥ {incomeTotal.toFixed(2)}</Text>
          </View>
        </View>
        <View className={styles.process}>
          {(Array(countOfExpenseDots)).fill(0).map((_, index) =>
            <View key={`exp${index}`} className={classNames([styles.dot, styles.expense])}/>
          )}
          {(Array(20 - countOfExpenseDots)).fill(0).map((_, index) =>
            <View key={`inc${index}`} className={classNames([styles.dot, styles.income])}/>
          )}
        </View>
      </View>
    </MediaCard>
  );
};

export default AnalyseMonthCard;
