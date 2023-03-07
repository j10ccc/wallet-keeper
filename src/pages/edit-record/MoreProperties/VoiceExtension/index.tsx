import useEnv from "@/hooks/useEnv";
import { View } from "@tarojs/components";
import Taro, { requirePlugin } from "@tarojs/taro";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import { UploadVoiceWordsAPI } from "@/services/bill/UploadVoiceWords";

const VoiceExtension = () => {
  const recordRecoManager = useRef<any>();
  const [isRecording, setIsRecording] = useState(false);
  const plugin = requirePlugin("WechatSI");

  const recorderOptions = useRef({
    duration: 10000,
    lang: "zh_CN"
  });

  useEffect(() => {
    recordRecoManager.current = plugin.getRecordRecognitionManager();
    console.log(recordRecoManager.current);
    recordRecoManager.current!.onStart = () => {
      console.log("start");
    };
    recordRecoManager.current!.onStop = (res) => {
      console.log(res.result);
      UploadVoiceWordsAPI({ sentence: res.result })
        .then(res => {
          console.log(res);
        });
    };
  }, []);

  const handleRecordStart = () => {
    setIsRecording(true);
    recordRecoManager.current!.start(recorderOptions.current);
  };

  const handleRecordStop = () => {
    setIsRecording(false);
    recordRecoManager.current!.stop();
  };

  const uploadRecord = (path: string) => {
    Taro.uploadFile({
      url: useEnv().baseUrl,
      filePath: path,
      name: "voice",
      success: (res) => {
        console.log(res);
      }
    });
  };

  return (
    <View className={
      classNames([
        styles.extension,
        isRecording ? styles.active : undefined
      ])
    }>
      <View
        className={styles.label}
        onClick={() => isRecording ? handleRecordStop() : handleRecordStart()}
      >
        { isRecording ? "录音中" : "录音"}
      </View>
    </View>
  );
};

export default VoiceExtension;
