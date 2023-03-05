import { ReactNode } from "react";
import { Text, View } from "@tarojs/components";

import styles from "./index.module.scss";

type PropsType = {
  title: string;
  children: ReactNode;
}

const MediaCard = (props: PropsType) => {
  const { title, children } = props;
  return (
    <View className={styles.card}>
      <View className={styles.header}>
        <Text className={styles.title}>{ title }</Text>
        <View className={styles.extra}>
          { /** TODO */}
        </View>
      </View>
      <View className={styles.body}>
        { children }
      </View>
      <View className={styles.footer}>
      </View>
    </View>
  );
};

export default MediaCard;
