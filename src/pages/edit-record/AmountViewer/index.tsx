import { View, Text, Input } from "@tarojs/components";

import { forwardRef, memo, useEffect, useImperativeHandle, useState } from "react";
import type { CommonEvent } from "@tarojs/components";
import type { InputEventDetail } from "taro-ui/types/input";
import styles from "./index.module.scss";

type PropsType = {
  defaultRemark?: string;
  defaultAmount?: string;
  onInputRemark: (e: CommonEvent<InputEventDetail>) => void;
}

export type AmountViewerRef = {
  setRemark: (value: string) => void;
  setAmount: (value: string | ((value: string) => void)) => void;
  amount: string;
}

const RemarkInput = memo((props: {
  onInput: PropsType["onInputRemark"],
  defaultValue?: string;
}) => {

  return (
    <Input
      className={styles.input}
      placeholder="点此输入备注..."
      onInput={props.onInput}
      value={props.defaultValue}
    />);
});

RemarkInput.displayName = "RemarkInput";

const AmountViewer = forwardRef<AmountViewerRef, PropsType>((props, ref) => {
  // remark default value
  const [defaultRemark, setDefaultRemark] = useState<string | undefined>(props.defaultRemark);
  const [amount, setAmount] = useState<string>(props.defaultAmount || "0.00");

  useEffect(() => {
    setDefaultRemark(props.defaultRemark);
  }, [props.defaultRemark]);

  useImperativeHandle(ref, () => {
    return {
      setRemark: setDefaultRemark,
      setAmount: setAmount,
      amount: amount
    };
  }, [amount]);

  return (
    <View className={styles.container}>
      <View className={styles.remark}>
        <RemarkInput onInput={props.onInputRemark} defaultValue={defaultRemark} />
      </View>
      <Text className={styles.content}>{amount}</Text>
    </View>
  );
});

AmountViewer.displayName = "AmountViewer";

export default AmountViewer;
