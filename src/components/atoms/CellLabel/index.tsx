import styles from "./index.module.scss";
import { View, Text } from "@tarojs/components";

type PropsType = {
  title: string;
};

const CellLabel = (props: PropsType) => {
  return (
    <View className={styles.title}>
      <Text>{props.title}</Text>
    </View>
  );
};

export default CellLabel;
