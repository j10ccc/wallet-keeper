import { View } from "@tarojs/components";
import { AtModal } from "taro-ui";
import Calendar from "../calendar";

import styles from "./index.module.scss";

type PropsType = {
  isShow: boolean
  onConfirm: (date: string) => void;
  onClose: () => void;
}

const DateSelectorModal = (props: PropsType) => {
  const { isShow, onClose, onConfirm } = props;

  return (
    <AtModal
      onClose={onClose}
      isOpened={isShow}
    >
      <View className={styles.container}>
        <Calendar
          onDayClick={(item) => onConfirm(item.value)}
          format="YYYY-M-D"
        />

      </View>
    </AtModal>
  );
};

export default DateSelectorModal;
