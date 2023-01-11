import { Text, View } from "@tarojs/components";
import styles from "./index.module.scss";

type PropsType = {
  content: string
}

const ContentPreview = (props: PropsType) => {
  const { content } = props;
  return (
    <View className={styles.container}>
      <Text className={styles.content}>{ content }</Text>
    </View>
  );
};

export default ContentPreview;
