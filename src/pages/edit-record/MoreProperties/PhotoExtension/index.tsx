import { useEditDraft } from "@/stores/useEditDraft";
import { View } from "@tarojs/components";

import styles from "./index.module.scss";

const PhotoExtension = () => {
  const { setInputMode } = useEditDraft();

  const handleClick = () => {
    setInputMode("image");
  };


  return (
    <View className={styles.extension} onClick={handleClick}>
      <View className={styles.label}>照片</View>
    </View>
  );
};

export default PhotoExtension;
