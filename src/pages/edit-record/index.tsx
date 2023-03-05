import { useEditDraft } from "@/stores/useEditDraft";
import { View, Text } from "@tarojs/components";
import { useRef, useState } from "react";
import NumberKeyboard from "@/components/NumberKeyboard";
import Taro, { useRouter } from "@tarojs/taro";
import KindSelector from "@/components/KindSelector";
import styles from "./index.module.scss";
import MoreProperties from "./MoreProperties";
import { useBillRecords } from "@/stores/useBillRecords";
import { omit } from "lodash-es";
import { expenseItemList } from "../constants/RecordItemList";
import { useGuid } from "@/hooks/useGuid";

const evalExpOfTwo = (content: string): number => {
  let res = 0;
  let index = -1;
  content.split("").forEach((item, i) => {
    if (item === "+" || item === "-")
      index = i;
  });

  if (index === -1) return parseFloat(content);
  else {
    const a = parseFloat(content.slice(0, index + 1)) || 0;
    const b = parseFloat(content.slice(index + 1)) || 0;
    if (content[index] === "+") res = a + b;
    else res = a - b;
  }
  return Math.floor(res * 100 + 0.5) / 100;
};

export type DraftType = Omit<BillAPI.BillRecord, "uid"> & { uid?: string };

const EditRecordPage = () => {
  // TODO: loading cache
  let defaultValue: DraftType;
  const mode = useRouter().params.mode;
  if (mode === "update")
    defaultValue = useEditDraft(state => state.record!);
  else defaultValue = {
    date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
    value: 0,
    kind: expenseItemList[0].value,
    type: "expense",
  };

  const recordRef = useRef<DraftType>(defaultValue);
  const [content, setContent] = useState(recordRef.current?.value.toString() || "0.00");

  const { updateItem, addItem } = useBillRecords();
  const resetDraft = useEditDraft(state => state.reset);

  /**
   * 结算
   */
  const onConfirm = () => {
    const res = evalExpOfTwo(content);
    if (recordRef.current) recordRef.current.value = res;
    if (mode === "create") {
      addItem({
        uid: useGuid().guid,
        ...recordRef.current
      });
    } else if (mode === "update") {
      updateItem(
        recordRef.current!.uid!,
        omit(recordRef.current!, ["uid"])
      );
    }

    setContent("0");
    resetDraft();
    Taro.navigateBack();
  };

  const onDelete = () => {
    if (content.length === 1) setContent("0");
    else setContent(value => value.slice(0, value.length - 1));
  };

  const onReset = () => {
    setContent("0");
    // TODO: submit but not close

  };

  const onInput = (key: string) => {
    const currentNum = content.split(/[+]|-/).pop() || "0";
    if (key === ".") {
      // .
      if (currentNum.includes(".")) return;
      // else setContent(content => `${content}${currentNum === "0" ? "0." : key}`);
      else setContent(content => content + key);
    } else if (key === "+" || key === "-") {
      // + -
      if (content === "0" || content === "0.00") return;
      if (content.endsWith("+"))
        setContent(content => content.slice(0, content.length - 1) + "-");
      else if (content.endsWith("-"))
        setContent(content => content.slice(0, content.length - 1) + "+");
      else {
        const res = evalExpOfTwo(content);
        setContent(()=> res.toString()+ key);
      }
    } else {
      // 1 2 3
      if (content === "0" || content === "0.00") setContent(key);
      else if (currentNum.includes(".") && currentNum.split(".")[1].length == 2)
        Taro.showToast({title: "最多2位小数", icon:"none"});
      else if (!currentNum.includes(".") && currentNum.split(".")[0].length === 8)
        Taro.showToast({title: "最多8位整数", icon:"none"});
      else setContent(content => content + key);
    }
  };

  const handleSelectKind = (e: { kind: string, type: string }) => {
    if (recordRef.current) {
      // FIXME:
      recordRef.current.type = e.type;
      recordRef.current.kind = e.kind;
    }
  };

  return (
    <View>
      <KindSelector
        onSelect={handleSelectKind}
        defaultValue={{
          kind: recordRef.current?.kind,
          type: recordRef.current?.type
        }}
      />
      <View className={styles.sum}>
        <Text className={styles.content}>{ content }</Text>
      </View>
      <MoreProperties record={recordRef}/>
      <NumberKeyboard
        onConfirm={onConfirm}
        onDelete={onDelete}
        onInput={onInput}
        onReset={onReset}
      />
    </View>
  );
};

export default EditRecordPage;
