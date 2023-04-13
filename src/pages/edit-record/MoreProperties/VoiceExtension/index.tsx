import { View } from "@tarojs/components";
import classNames from "classnames";
import styles from "./index.module.scss";
import { useEditDraft } from "@/stores/useEditDraft";

const VoiceExtension = () => {
  const { setInputMode } = useEditDraft();

  const handleClickRecord = () => {
    setInputMode("voice");
  };

  return (
    <View className={classNames([ styles.extension ])}>
      <View
        className={styles.label}
        onClick={handleClickRecord}
      >
        录音
      </View>
    </View>
  );
};

export default VoiceExtension;
