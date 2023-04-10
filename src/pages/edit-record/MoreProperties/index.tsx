import { View } from "@tarojs/components";
import styles from "./index.module.scss";
import DateExtension, { DateExtensionRef } from "./DateExtension";
import PhotoExtension from "./PhotoExtension";
import VoiceExtension from "./VoiceExtension";
import LedgerExtension from "./LedgerExtension";
import { forwardRef, memo, useImperativeHandle, useRef } from "react";

type PropsType = {
  record: React.RefObject<BillAPI.DraftType>;
};

export type MorePropertiesRef = {
  setDate: (value: string) => void;
}

const MoreProperties = forwardRef<MorePropertiesRef, PropsType>((props, ref) => {
  const dateExtensionRef = useRef<DateExtensionRef>(null);
  console.log("MoreProperties render");

  useImperativeHandle(ref, () => {
    console.log(dateExtensionRef.current);
    return {
      setDate: dateExtensionRef.current!.setDate
    };
  }, []);

  return (
    <View className={styles.container}>
      <LedgerExtension originValue={props.record} />
      <DateExtension ref={dateExtensionRef} defaultValue={props.record.current?.date} />
      <PhotoExtension />
      <VoiceExtension originValue={props.record} />
    </View>
  );
});

MoreProperties.displayName = "MoreProperties";

export default memo(MoreProperties);
