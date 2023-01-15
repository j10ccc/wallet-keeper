import { View, Text } from "@tarojs/components";

import styles from "./index.module.scss";

const FormPageHeader = (
  props: { title: string }
)=> {
  const { title } = props;

  return <View className={styles.header}>
    <Text className={styles.title}>{ title }</Text>
  </View>;
};

export default FormPageHeader;
