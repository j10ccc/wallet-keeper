import useEnv from "@/hooks/useEnv";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";

const VoiceExtension = () => {
  const recoderManager = useRef<Taro.RecorderManager>();
  const [isRecording, setIsRecording] = useState(false);

  const recorderOptions = useRef<Taro.RecorderManager.StartOption>({
    duration: 10000,
    sampleRate: 44100,
    numberOfChannels: 1,
    encodeBitRate: 192000,
    format: "aac",
    frameSize: 50
  });

  useEffect(() => {
    recoderManager.current = Taro.getRecorderManager();
    recoderManager.current.onStart(() => {
      console.log("start");
    });
    recoderManager.current.onStop((res) => {
      uploadRecord(res.tempFilePath);
    });
  }, []);

  const handleRecordStart = () => {
    setIsRecording(true);
    recoderManager.current?.start(recorderOptions.current);
  };

  const handleRecordStop = () => {
    setIsRecording(false);
    recoderManager.current?.stop();
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
