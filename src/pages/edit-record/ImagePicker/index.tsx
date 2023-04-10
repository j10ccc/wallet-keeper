import { View, Text } from "@tarojs/components";
import { UploadPhotoAPI } from "@/services/bill/UploadPhotoAPI";
import Taro from "@tarojs/taro";

import styles from "./index.module.scss";
import { useEditDraft } from "@/stores/useEditDraft";
import { useContext } from "react";
import EditContext from "../EditContext";

const ImagePicker = () => {
  const { setInputMode } = useEditDraft();
  const { updateEffect } = useContext(EditContext);

  const handleClick = (type: "default" | "train") => {
    Taro.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      sizeType: ["compressed"],
      success: async (res) => {
        try {
          Taro.showLoading({
            title: "正在上传",
          });
          const tmp = await UploadPhotoAPI({
            filePath: res.tempFiles[0].tempFilePath,
            type
          });
          if (tmp.code === 200) {
            updateEffect({
              ...tmp.data,
              value: parseFloat(tmp.data.value)
            });
          }
        } catch (e) {
          console.log(e);
        } finally {
          Taro.hideLoading();
        }
      },
    });
  };

  const handleBack = () => {
    setInputMode("keyboard");
  };

  return <View className={styles.container}>
    <View className={styles.body}>
      <View className={styles.item} onClick={() => handleClick("default")}>
        <View className={styles.icon}>
        </View>
        <View className={styles.label}>
          <Text>普通票据</Text>
        </View>
      </View>
      <View className={styles.item} onClick={() => handleClick("train")}>
        <View className={styles.icon}>
        </View>
        <View className={styles.label}>
          <Text>火车票</Text>
        </View>
      </View>
    </View>
    <View className={styles.footer}>
      <View className={styles.back} onClick={handleBack}>
        <Text>返回键盘输入</Text>
      </View>
    </View>
  </View>;
};

export default ImagePicker;
