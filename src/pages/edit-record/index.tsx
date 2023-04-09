import { useEditDraft } from "@/stores/useEditDraft";
import { View, Text, Input } from "@tarojs/components";
import type { CommonEvent } from "@tarojs/components";
import type { InputEventDetail } from "taro-ui/types/input";
import { useEffect, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import NumberKeyboard from "@/components/NumberKeyboard";
import Taro, { useRouter } from "@tarojs/taro";
import KindSelector from "@/components/KindSelector";
import styles from "./index.module.scss";
import MoreProperties from "./MoreProperties";
import { useBillRecords } from "@/stores/useBillRecords";
import { omit } from "lodash-es";
import { expenseItemList } from "@/constants/RecordItemList";
import { useGuid } from "@/hooks/useGuid";
import { InsertItemAPI } from "@/services/bill/InsertItemAPI";
import { UpdateItemAPI } from "@/services/bill/UpdateItemAPI";
import { useLedger } from "@/stores/useLedger";

const evalExpOfTwo = (content: string): number => {
  let res = 0;
  let index = -1;
  content.split("").forEach((item, i) => {
    if (item === "+" || item === "-") index = i;
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

const EditRecordPage = () => {
  const { record: recordInStore } = useEditDraft();
  const ledgers = useLedger((store) => store.list);

  // TODO: loading cache
  let defaultValue: BillAPI.DraftType | null;
  const { mode, ledgerID } = useRouter().params;
  console.log("page render");

  if (mode === "update") defaultValue = recordInStore;
  else
    defaultValue = {
      date: `${new Date().getFullYear()}-${
        new Date().getMonth() + 1
      }-${new Date().getDate()}`,
      value: 0,
      kind: expenseItemList[0].value,
      type: "expense",
      ledgerID: ledgerID ? parseInt(ledgerID) : ledgers[0]?.id,
      remark: undefined,
    };

  // TODO: decrease render times
  useEffect(() => {
    setContent((recordInStore?.value || 0).toFixed(2));
    recordRef.current = {
      ...recordRef.current,
      ...recordInStore,
    };
  }, [recordInStore]);

  const recordRef = useRef<BillAPI.DraftType>(defaultValue) as MutableRefObject<BillAPI.DraftType>;
  const [content, setContent] = useState(
    recordRef.current?.value?.toString() || "0.00"
  );

  const { updateItem, addItem } = useBillRecords();
  const resetDraft = useEditDraft((state) => state.reset);

  /**
   * 结算
   */
  const onConfirm = async () => {
    const res = evalExpOfTwo(content);
    if (recordRef.current) recordRef.current.value = res;
    console.log(recordRef.current);

    try {
      let id: number | undefined = undefined;
      if (mode === "create") {
        // create
        const res = await InsertItemAPI({
          ...omit(recordRef.current, ["ledgerID"]),
          value: recordRef.current.value.toFixed(2),
          type: recordRef.current.type === "expense" ? true : false,
          ledger_id: recordRef.current.ledgerID,
        });
        if (res.data.code === 200) {
          console.log("insert result:", res);
          id = res.data.data;
        } else {
          addItem({
            id,
            uid: useGuid().guid,
            ...recordRef.current,
          });
          throw new Error(res.data.msg);
        }
      } else if (mode === "update") {
        // update
        // TODO: set a property to show offline state
        updateItem(recordRef.current!.uid!, omit(recordRef.current!, ["uid"]));
        console.log("updated");
        const res = await UpdateItemAPI({
          ...recordRef.current,
          value: recordRef.current.value.toFixed(2),
          type: recordRef.current.type === "expense" ? true : false,
        });
        if (res.data.code === 200) {
          console.log("update result:", res);
        } else {
          throw new Error(res.data.msg);
        }
      }
    } catch (e) {
      Taro.showToast({
        icon: "none",
        title: e.message,
      });
      console.log(e.message);
    }

    setContent("0");
    resetDraft();
    Taro.navigateBack();
  };

  const onDelete = () => {
    if (content.length === 1) setContent("0");
    else setContent((value) => value.slice(0, value.length - 1));
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
      else setContent((content) => content + key);
    } else if (key === "+" || key === "-") {
      // + -
      if (content === "0" || content === "0.00") return;
      if (content.endsWith("+"))
        setContent((content) => content.slice(0, content.length - 1) + "-");
      else if (content.endsWith("-"))
        setContent((content) => content.slice(0, content.length - 1) + "+");
      else {
        const res = evalExpOfTwo(content);
        setContent(() => res.toString() + key);
      }
    } else {
      // 1 2 3
      if (content === "0" || content === "0.00") setContent(key);
      else if (currentNum.includes(".") && currentNum.split(".")[1].length == 2)
        Taro.showToast({ title: "最多2位小数", icon: "none" });
      else if (
        !currentNum.includes(".") &&
        currentNum.split(".")[0].length === 8
      )
        Taro.showToast({ title: "最多8位整数", icon: "none" });
      else setContent((content) => content + key);
    }
  };

  const handleSelectKind = (e: { kind: string; type: string }) => {
    if (recordRef.current) {
      // FIXME:
      recordRef.current.type = e.type;
      recordRef.current.kind = e.kind;
    }
  };

  const handleInputRemark = (e: CommonEvent<InputEventDetail>) => {
    recordRef.current.remark = e.detail.value as string;
  };

  return (
    <View>
      <KindSelector
        onSelect={handleSelectKind}
        defaultValue={{
          kind: recordRef.current?.kind,
          type: recordRef.current?.type,
        }}
      />
      <View className={styles.sum}>
        <View className={styles.remark}>
          <Input
            className={styles.input}
            placeholder="点此输入备注..."
            onInput={handleInputRemark}
            value={defaultValue?.remark}
          />
        </View>
        <Text className={styles.content}>{content}</Text>
      </View>
      <MoreProperties record={recordRef} />
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
