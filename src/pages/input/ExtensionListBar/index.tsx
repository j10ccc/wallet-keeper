import { View } from "@tarojs/components";
import { useState } from "react";
import DateSelectorModal from "@/components/DateSelectorModal";
import useDay from "@/hooks/useDay";
import { useInputDraft } from "@/stores/useInputDraft";

import styles from "./index.module.scss";

const DateExtension = () => {
  const [date, setDate] = useState("今天");
  const [showDateSelector, setShowDateSelector] = useState(false);
  const { setDate: setDateDraft } = useInputDraft();

  const onSubmit = (date: string) => {
    setDate(() => {
      const {
        isToday,
        isYesterday,
        isTheDayBeforeYesterday
      } = useDay(date);
      if (isToday) return "今天";
      else if (isYesterday) return "昨天";
      else if (isTheDayBeforeYesterday) return "前天";
      else return date;
    });
    setDateDraft(date);
    setShowDateSelector(false);
  };

  const onClose = () => {
    setShowDateSelector(false);
  };

  return (
    <>
      <DateSelectorModal
        isShow={showDateSelector}
        onConfirm={onSubmit}
        onClose={onClose}
      />
      <View className={styles.extension} onClick={() => {setShowDateSelector(true);}}>
        <View className={styles.label}>{ date }</View>
      </View>
    </>
  );
};

const ExtentsionListBar = () => {
  return <View className={styles.container}>
    <DateExtension />
  </View>;
};

export default ExtentsionListBar;
