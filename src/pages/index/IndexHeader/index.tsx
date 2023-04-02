import { CommonEvent, Picker, Text, View } from "@tarojs/components";
import styles from "./index.module.scss";
import { AtIcon } from "taro-ui";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useQueryBills } from "@/stores/useQueryBills";
import dayjs from "dayjs";
import { useBillRecords } from "@/stores/useBillRecords";
import { useLedger } from "@/stores/useLedger";
import Taro from "@tarojs/taro";

const TypeSelector = () => {
  const range = useRef({
    default: "全部",
    income: "收入",
    expense: "支出",
  });

  const { type, setType } = useQueryBills();

  const handleSelect = (e: CommonEvent) => {
    setType(Object.keys(range.current)[parseInt(e.detail.value)]);
  };

  return (
    <Picker
      mode="selector"
      range={Object.values(range.current)}
      onChange={handleSelect}
    >
      <View className={classNames(styles["type-selector"], styles["selector"])}>
        <Text>{range.current[type]}</Text>
      </View>
    </Picker>
  );
};

const DateSelector = () => {
  const { date, setDate } = useQueryBills();

  const handleSelect = (e: CommonEvent) => {
    const [year, month] = e.detail.value
      .split("-")
      .map((item) => parseInt(item));
    setDate(year, month);
  };

  return (
    <Picker
      mode="date"
      onChange={handleSelect}
      fields="month"
      value={`${dayjs(new Date(date.year, date.month - 1)).format(
        "YYYY-MM-DD"
      )}`}
    >
      <View className={classNames(styles["date-selector"], styles["selector"])}>
        <Text>{`${date.year}年 ${date.month}月 `}</Text>
        <AtIcon value="chevron-down" size="16" color="#ffffff99" />
      </View>
    </Picker>
  );
};

const LedgerSelector = () => {
  const { ledgerID } = useQueryBills();
  const { list: ledgers } = useLedger();

  const [ledgerName, setledgerName] = useState(() => {
    if (ledgerID === undefined) return "点击获取账本";
    else return ledgers[0].name;
  });

  useEffect(() => {
    if (ledgerID === undefined) return;
    setledgerName(
      ledgers.find((item) => item.id === ledgerID)?.name || "未知账本"
    );
  }, [ledgers, ledgerID]);

  const handleClick = () => {
    Taro.navigateTo({
      url: "/pages/ledger-manager/index",
    });
  };

  return (
    <View className={styles["ledger-name"]} onClick={handleClick}>
      <Text>{ledgerName}</Text>
    </View>
  );
};

const StatisticText = () => {
  const { date, type } = useQueryBills();
  const { list } = useBillRecords();

  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);

  const calcTotal = () => {
    let income = 0;
    let expense = 0;

    income = list
      .filter(
        (item) =>
          item.date.startsWith(`${date.year}-${date.month}-`) &&
          item.type === "income"
      )
      .map((item) => item.value)
      .reduce((prev, curr) => prev + curr, 0);

    expense = list
      .filter(
        (item) =>
          item.date.startsWith(`${date.year}-${date.month}-`) &&
          item.type === "expense"
      )
      .map((item) => item.value)
      .reduce((prev, curr) => prev + curr, 0);

    income = Math.floor(income * 100 + 0.5) / 100;
    expense = Math.floor(expense * 100 + 0.5) / 100;
    setIncomeTotal(income);
    setExpenseTotal(expense);
  };

  useEffect(() => {
    calcTotal();
  }, [date, list]);

  return (
    <View className={styles["statistic-text"]}>
      {(type === "default" || type === "expense") && (
        <Text>{`总支出¥ ${expenseTotal}`}</Text>
      )}
      {(type === "default" || type === "income") && (
        <Text>{`总收入¥ ${incomeTotal}`}</Text>
      )}
    </View>
  );
};

const IndexHeader = () => {
  return (
    <View className={styles.container}>
      <View className={styles["selectors"]}>
        <DateSelector />
        <TypeSelector />
      </View>
      <View className={styles["detail"]}>
        <StatisticText />
        <LedgerSelector />
      </View>
    </View>
  );
};

export default IndexHeader;
