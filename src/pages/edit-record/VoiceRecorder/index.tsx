import { useEditDraft } from "@/stores/useEditDraft";
import { View, Text } from "@tarojs/components";
import { memo, useCallback, useState, useRef, useEffect, useContext } from "react";
import { AtIcon } from "taro-ui";
import { requirePlugin } from "@tarojs/taro";
import { UploadVoiceWordsAPI } from "@/services/bill/UploadVoiceWords";
import dayjs from "dayjs";
import EditContext from "../EditContext";
import Taro from "@tarojs/taro";
import styles from "./index.module.scss";

type ControllerPropsType = {
  onStart: () => void;
  onFinish: () => void;
}

const RecordController = memo((props: ControllerPropsType) => {
  const [isRecording, setIsRecording] = useState(false);

  console.log("controller render");

  const handleTouchStart = () => {
    setIsRecording(true);
    props.onStart();
  };

  const handleTouchEnd = () => {
    setIsRecording(false);
    props.onFinish();
  };

  return (
    <>
      <View
        className={styles.btn}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AtIcon prefixClass="icon" value="microphone" size={32} />
      </View>
      <View className={styles.tip}>
        { !isRecording && <Text>长按以录音</Text> }
        { isRecording && <Text>松开结束录音</Text> }
      </View>
    </>
  );
});

RecordController.displayName = "RecordController";

const VoiceRecorder = () => {
  const { setInputMode } = useEditDraft();
  const plugin = requirePlugin("WechatSI");
  const { updateEffect } = useContext(EditContext);

  const recordRecoManager = useRef<any>();
  const recorderOptions = useRef({
    duration: 10000,
    lang: "zh_CN",
  });

  useEffect(() => {
    recordRecoManager.current = plugin.getRecordRecognitionManager();
    recordRecoManager.current!.onStart = () => {
      console.log("start record");
    };
    recordRecoManager.current!.onStop = (res) => {
      console.log("finish record", res.result);
      UploadVoiceWordsAPI({ sentence: res.result || "昨天三餐花了10元" }).then(
        (res) => {
          console.log("WechatSI Result:", res.data.data);
          const {
            date,
            value,
            type,
            remark
          } = res.data.data;
          updateEffect({
            date: dayjs(date).format("YYYY-MM-DD"),
            type: type ? "expense" : "income",
            value: value ? parseFloat(value) : undefined,
            remark
          });
        }
      );
    };
  }, []);

  const timer = useRef(-1);
  const isRecordLongEnough = useRef(false);

  const handleRecordStart = useCallback(() => {
    timer.current = setTimeout(() => {
      isRecordLongEnough.current = true;
    }, 1000);
    recordRecoManager.current!.start(recorderOptions.current);
  }, []);

  const handleRecordFinish = useCallback(() => {
    clearTimeout(timer.current);
    if (!isRecordLongEnough.current) {
      Taro.showToast({
        title: "录音时间太短啦",
        icon: "none"
      });
    } else {
      recordRecoManager.current!.stop();
    }

    isRecordLongEnough.current = false;
  }, []);

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <View className={styles.tip}>
          <Text>尝试这样说：今天晚餐花了十元</Text>
        </View>
      </View>
      <View className={styles.body}>
        <RecordController onFinish={handleRecordFinish} onStart={handleRecordStart} />
      </View>
      <View className={styles.footer}>
        <View className={styles.icon} onClick={() => setInputMode("keyboard")}>
          <AtIcon prefixClass="icon" value="keyboard" />
        </View>
        <View className={styles.icon} onClick={() => setInputMode("image")}>
          <AtIcon prefixClass="icon" value="camera" />
        </View>
      </View>
    </View>
  );

};

export default VoiceRecorder;
