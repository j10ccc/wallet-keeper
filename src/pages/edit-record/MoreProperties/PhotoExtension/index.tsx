import { UploadPhotoAPI } from "@/services/bill/UploadPhotoAPI";
import { useEditDraft } from "@/stores/useEditDraft";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";

import styles from "./index.module.scss";

const PhotoExtension = () => {
  const { setDraft } = useEditDraft();

  const handleSelectPhoto = () => {
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
          });
          setDraft({
            ...tmp.data,
            value: parseFloat(tmp.data.value),
          });
        } catch (e) {
          console.log(e);
        } finally {
          Taro.hideLoading();
        }
      },
    });
  };

  return (
    <>
      <View className={styles.extension} onClick={handleSelectPhoto}>
        <View className={styles.label}>照片</View>
      </View>
    </>
  );
};

export default PhotoExtension;
