import { View, Text } from "@tarojs/components";
import { memo } from "react";

import styles from "./index.module.scss";

type PropsType = {
  onInput: (key: string) => void;
  onConfirm: () => void;
  onDelete: () => void;
  onReset: () => void;
}

type KeyType = {
  label: string;
  role?: "text" | "reset" | "save" | "delete";
  trigger?: (key: string) => void
}

const NumberKeyboard = (props: PropsType) => {
  const { onConfirm, onDelete, onInput, onReset } = props;

  const keyList: KeyType[] = [
    { label: "1" },
    { label: "2" },
    { label: "3" },
    { label: "删除", role: "delete", trigger: onDelete },
    { label: "4" },
    { label: "5" },
    { label: "6" },
    { label: "-" },
    { label: "7" },
    { label: "8" },
    { label: "9" },
    { label: "+" },
    { label: "再记", role: "reset", trigger: onReset },
    { label: "0" },
    { label: "." },
    { label: "保存", role: "save", trigger: onConfirm },
  ];

  return (
    <View className={styles.container}>
      {keyList.map(item =>
        <View
          key={item.label}
          className={
            `${styles.key}${" "}
            ${styles[`key-${item.role}`]}`
          }
          onClick={() => {
            if (item.role === undefined || item.role === "text")
              return onInput(item.label);
            else return item.trigger?.(item.label);
          }}
          // data-role={item.role}
        >
          <Text className={styles.text}>
            { item.label }
          </Text>
        </View>
      )}
    </View>
  );
};

export default memo(NumberKeyboard);
