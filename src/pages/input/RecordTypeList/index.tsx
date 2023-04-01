import { View, Text, ScrollView } from "@tarojs/components";
import { RecordTypeItem } from "@/constants/RecordItemList";
import { AtIcon } from "taro-ui";
import { useInputDraft } from "@/stores/useInputDraft";
import classnames from "classnames";

import styles from "./index.module.scss";

const TypeItem = (props: RecordTypeItem) => {
  const { value, label } = props;
  const { type, setType } = useInputDraft();

  const handleSelect = () => {
    setType(value);
  };

  return (
    <View className={styles.item} onClick={handleSelect}>
      <View
        className={classnames(styles["icon-wrapper"], {
          [styles["icon-wrapper-selected"]]: type === value,
        })}
      >
        <AtIcon className={styles.icon} prefixClass="icon" value={value} />
      </View>
      <Text className={styles.label}>{label}</Text>
    </View>
  );
};

type ListPropsType = {
  list: RecordTypeItem[];
};

const RecordTypeList = (props: ListPropsType) => {
  const { list } = props;
  return (
    <ScrollView scrollY enableFlex className={styles["tab-scroll-view"]}>
      <View className={styles.container}>
        {list.map((item) => (
          <TypeItem key={item.value} value={item.value} label={item.label} />
        ))}
      </View>
    </ScrollView>
  );
};

export default RecordTypeList;
