import DateSelectorModal from "@/components/DateSelectorModal";
import useDay from "@/hooks/useDay";
import { View } from "@tarojs/components";
import { useState, forwardRef, useImperativeHandle, useContext } from "react";
import EditContext from "../../EditContext";

import styles from "./index.module.scss";

export type DateExtensionRef = {
  setDate: (date: string) => void;
}

const DateExtension = forwardRef<DateExtensionRef, {
  defaultValue: string;
}>((props, ref) => {
  const defaultDate = props.defaultValue;
  const [date, setDate] = useState("今天");
  const [showDateSelector, setShowDateSelector] = useState(false);
  const { recordRef, updateEffect } = useContext(EditContext);

  useImperativeHandle(ref, () => {
    return {
      setDate: transformDate,
    };
  }, []);

  const transformDate = (date: string) => {
    setDate(() => {
      const { isToday, isYesterday, isTheDayBeforeYesterday } =
          useDay(date);
      if (isToday) return "今天";
      else if (isYesterday) return "昨天";
      else if (isTheDayBeforeYesterday) return "前天";
      else return date;
    });
  };

  const onSubmit = (date: string) => {
    updateEffect({ date });
    setShowDateSelector(false);
  };

  const onClose = () => {
    setShowDateSelector(false);
  };

  return (
    <>
      <DateSelectorModal
        defaultDate={defaultDate}
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
});

DateExtension.displayName = "DateExtension";

export default DateExtension;
