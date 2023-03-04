import { UploadPhotoAPI } from "@/services/bill/UploadPhotoAPI";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";

import styles from "./index.module.scss";

const PhotoExtension = () => {

  const handleSelectPhoto = () => {
    Taro.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      sizeType: ["compressed"],
      success: (res) => {
        UploadPhotoAPI({
          filePath: res.tempFiles[0].tempFilePath,
        });
      }
    });
  };


  return (
    <>
      <View className={styles.extension}
        onClick={handleSelectPhoto}
      >
        <View className={styles.label}>照片</View>
      </View>
    </>
  );
};

export default PhotoExtension;

