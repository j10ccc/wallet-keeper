import DateSelectorModal from "@/components/DateSelectorModal";
import useDay from "@/hooks/useDay";
import { View } from "@tarojs/components";
import { useState, useEffect } from "react";

import styles from "./index.module.scss";

const DateExtension = ({
  record,
}: {
  record: React.RefObject<BillAPI.DraftType>;
}) => {
  const defaultDate = record.current?.date;
  const [date, setDate] = useState("今天");
  const [showDateSelector, setShowDateSelector] = useState(false);

  useEffect(() => {
    defaultDate &&
      setDate(() => {
        const { isToday, isYesterday, isTheDayBeforeYesterday } =
          useDay(defaultDate);
        if (isToday) return "今天";
        else if (isYesterday) return "昨天";
        else if (isTheDayBeforeYesterday) return "前天";
        else return defaultDate;
      });
  });

  const onSubmit = (date: string) => {
    if (record.current) record.current.date = date;
    setShowDateSelector(false);
  };

  const onClose = () => {
    setShowDateSelector(false);
  };

  return (
    <>
      <DateSelectorModal
        defaultDate={record.current?.date}
        isShow={showDateSelector}
        onConfirm={onSubmit}
        onClose={onClose}
      />
      <View
        className={styles.extension}
        onClick={() => {
          setShowDateSelector(true);
        }}
      >
        <View className={styles.label}>{date}</View>
      </View>
    </>
  );
};

export default DateExtension;
