import { View } from "@tarojs/components";
import { AtCalendar, AtModal } from "taro-ui";

import styles from "./index.module.scss";
import { useState } from "react";

type PropsType = {
  defaultDate?: string;
  isShow: boolean
  onConfirm: (date: string) => void;
  onClose: () => void;
}

const DateSelectorModal = (props: PropsType) => {
  const { isShow, onClose, onConfirm, defaultDate } = props;
  const [date, setDate] = useState(defaultDate);

  return (
    <AtModal
      onClose={onClose}
      isOpened={isShow}
    >
      <View className={styles.container}>
        <AtCalendar
          currentDate={date || Date.now()}
          onDayClick={(e) => {
            setDate(e.value);
            onConfirm(e.value);
          }}
          format="YYYY-M-D"
        />
      </View>
    </AtModal>
  );
};

export default DateSelectorModal;
