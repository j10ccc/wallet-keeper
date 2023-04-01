import { Text, View } from "@tarojs/components";

import styles from "./index.module.scss";
import { AtIcon } from "taro-ui";
import classNames from "classnames";
import { itemValueLabelMap } from "@/constants/RecordItemList";
import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { useBillRecords } from "@/stores/useBillRecords";
import { useEditDraft } from "@/stores/useEditDraft";

type PropsType = {
  date: string;
  list: BillAPI.BillRecord[];
  type: string;
};

const TodayBill = (props: PropsType) => {
  const { date, list, type } = props;
  const [_, month, day] = date.split("-").map((item) => parseInt(item));
  const [statistic, setStatistic] = useState({
    income: 0,
    expense: 0,
  });

  const deleteBill = useBillRecords((state) => state.removeItem);
  const setEditDraft = useEditDraft((state) => state.setDraft);

  const [validList, setValidList] = useState<BillAPI.BillRecord[]>([]);

  const handleLongPress = (item: BillAPI.BillRecord) => {
    Taro.showActionSheet({
      itemList: ["编辑", "删除"],
      success: (e) => {
        if (e.tapIndex === 0) {
          setEditDraft(item);
          Taro.navigateTo({
            url: "/pages/edit-record/index?mode=update",
          });
        } else if (e.tapIndex === 1) {
          deleteBill(item.uid);
        }
      },
    });
  };

  useEffect(() => {
    if (type === "default") setValidList(list);
    else setValidList(list.filter((item) => item.type === type));
  }, [type, list]);

  useEffect(() => {
    let income = 0;
    let expense = 0;
    income = list
      .filter((item) => item.type === "income")
      .map((item) => item.value)
      .reduce((prev, curr) => prev + curr, 0);
    expense = list
      .filter((item) => item.type === "expense")
      .map((item) => item.value)
      .reduce((prev, curr) => prev + curr, 0);
    income = Math.floor(income * 100 + 0.5) / 100;
    expense = Math.floor(expense * 100 + 0.5) / 100;
    setStatistic({ income, expense });
  }, [date, list]);

  if (validList.length !== 0)
    return (
      <View className={styles.container}>
        <View className={styles.header}>
          <View className={styles.date}>
            <Text>{`${month}月${day}日`}</Text>
          </View>
          <View className={styles.statistic}>
            {statistic.expense !== 0 && (
              <Text className={styles.expense}>-{statistic.expense}</Text>
            )}
            {statistic.income !== 0 && (
              <Text className={styles.income}>+{statistic.income}</Text>
            )}
          </View>
        </View>
        <View className={styles.body}>
          {validList.map((item) => (
            <View
              key={item.uid}
              className={styles["list-item"]}
              onLongPress={() => handleLongPress(item)}
            >
              <View className={styles["icon-col"]}>
                <AtIcon
                  prefixClass="icon"
                  size="28"
                  value={item.kind}
                  className={classNames(styles["type"], styles[item.type])}
                />
              </View>
              <View className={styles["detail-col"]}>
                <Text className={styles.type}>
                  {itemValueLabelMap[item.kind]}
                </Text>
                <Text className={styles.desc}>{item.uid}</Text>
              </View>
              <View className={styles["value-col"]}>
                <Text className={classNames(styles["type"], styles[item.type])}>
                  {item.type === "income" && "+"}
                  {item.type === "expense" && "-"}
                  {item.value.toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  else return null;
};

export default TodayBill;
