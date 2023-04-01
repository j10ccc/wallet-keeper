import { View } from "@tarojs/components";
import { requirePlugin } from "@tarojs/taro";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import { UploadVoiceWordsAPI } from "@/services/bill/UploadVoiceWords";
import { useEditDraft } from "@/stores/useEditDraft";
import dayjs from "dayjs";

type PropsType = {
  originValue: React.RefObject<BillAPI.DraftType>
}

const VoiceExtension = (props: PropsType) => {
  const recordRecoManager = useRef<any>();
  const [isRecording, setIsRecording] = useState(false);
  const plugin = requirePlugin("WechatSI");
  const { setDraft } = useEditDraft();

  const originValue = props.originValue.current;

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
      UploadVoiceWordsAPI({ sentence: res.result || "昨天三餐花了10元" })
        .then(res => {
          console.log("res:", res.data.data);
          const {
            date = originValue!.date,
            value = originValue!.value.toString(),
            type = originValue!.type === "expense" ? true : false,
            // TODO: remark
          } = res.data.data;
          setDraft({
            date: dayjs(date).format("YYYY-MM-DD"),
            type: type ? "expense" : "income",
            value: parseFloat(value),
            kind: originValue!.kind,
          });
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
