import { Picker, View, Text, BaseEventOrig } from "@tarojs/components";
import dayjs from "dayjs";
import { memo, useState } from "react";
import { AtIcon } from "taro-ui";

import styles from "./index.module.scss";

type PropsType = {
  onSelect: (
    e: { value: { year: number, month: number }}
  ) => void;
  initialValue: { year: number, month: number };
}

const DateSelectorBar = (props: PropsType) => {
  const { onSelect, initialValue } = props;

  const [date, setDate] = useState(
    dayjs(new Date(initialValue.year, initialValue.month - 1))
      .format("YYYY-MM-DD")
  );

  const handleDateSelect = (e: Partial<BaseEventOrig<{ value: string }>>) => {
    setDate(`${e.detail!.value}-01`);
    const [year, month] = e.detail!.value.split("-").map(item => parseInt(item));
    onSelect({ value: { year, month }});
  };

  const handleSkipDate = (type: "next" | "previous") => {
    let newDate = date;
    if (type === "next") {
      newDate = dayjs(date).add(1, "month").format("YYYY-MM");
    } else {
      newDate = dayjs(date).add(-1, "month").format("YYYY-MM");
    }
    handleDateSelect({ detail: { value: newDate }});
  };

  return (
    <View className={styles.container}>
      <View className={styles.arrow} onClick={() => handleSkipDate("previous")}>
        <AtIcon value="chevron-left" />
      </View>
      <Picker
        value={date}
        mode="date"
        fields="month"
        onChange={handleDateSelect}
      >
        <View className={styles.date}>
          <Text>{date.split("-")[0]}年{date.split("-")[1]}月</Text>
        </View>
      </Picker>
      <View className={styles.arrow} onClick={() => handleSkipDate("next")}>
        <AtIcon value="chevron-right" />
      </View>
    </View>
  );
};

export default memo(DateSelectorBar);
