import { View, Text, ScrollView } from "@tarojs/components";
import { RecordTypeItem } from "..";

import styles from "./index.module.scss";
import { AtIcon } from "taro-ui";

const TypeItem = (props: RecordTypeItem) => {
  const { value, label } = props;
  return (
    <View className={styles.item} onClick={() => console.log(value)}>
      <View className={styles["icon-wrapper"]}>
        <AtIcon className={styles.icon} prefixClass="icon" value={value} />
      </View>
      <Text className={styles.label}>{label}</Text>
    </View>
  );
};

type ListPropsType = {
  list: RecordTypeItem[];
}

const RecordTypeList = (props: ListPropsType) => {
  const { list } = props;
  return (
    <ScrollView
      scrollY
      enableFlex
      className={styles["tab-scroll-view"]}
    >
      <View className={styles.container}>
        {list.map(item => (
          <TypeItem key={item.value} value={item.value} label={item.label} />
        ))}
      </View>
    </ScrollView>
  );
};

export default RecordTypeList;
