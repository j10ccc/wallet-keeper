import { Text, View } from "@tarojs/components";
import styles from "./index.module.scss";
import { AtIcon } from "taro-ui";
import Taro from "@tarojs/taro";

const CreateRecordBubble = () => {
  const onClick = () => {
    Taro.navigateTo({
      url: "/pages/edit-record/index?mode=create"
    });
  };

  return (
    <View className={styles.bubble} onClick={onClick}>
      <AtIcon value="edit" color="#478553" size={20} />
      <Text className={styles.text}>记一笔</Text>
    </View>
  );
};

export default CreateRecordBubble;
