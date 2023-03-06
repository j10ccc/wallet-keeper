import { CSSProperties, ReactNode } from "react";
import { Text, View } from "@tarojs/components";

import styles from "./index.module.scss";
import { AtIcon } from "taro-ui";

type PropsType = {
  title: string;
  children: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
}

const MediaCard = (props: PropsType) => {
  const { title, children, onClick, style } = props;
  return (
    <View className={styles.card} style={style}>
      <View className={styles.header} onClick={onClick}>
        <Text className={styles.title}>{ title }</Text>
        { onClick &&
          <View className={styles.extra}>
            <AtIcon value="chevron-right" color="#a6a6a6"/>
          </View>
        }
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
