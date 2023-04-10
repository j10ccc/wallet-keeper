import { useEditDraft } from "@/stores/useEditDraft";
import { View } from "@tarojs/components";
import type { CommonEvent } from "@tarojs/components";
import type { InputEventDetail } from "taro-ui/types/input";
import { useCallback, useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import NumberKeyboard from "@/components/NumberKeyboard";
import Taro, { useRouter } from "@tarojs/taro";
import KindSelector from "@/components/KindSelector";
import type { KindSelectorRef } from "@/components/KindSelector";
import MoreProperties from "./MoreProperties";
import { useBillRecords } from "@/stores/useBillRecords";
import { omit } from "lodash-es";
import { expenseItemList } from "@/constants/RecordItemList";
import { useGuid } from "@/hooks/useGuid";
import { InsertItemAPI } from "@/services/bill/InsertItemAPI";
import { UpdateItemAPI } from "@/services/bill/UpdateItemAPI";
import { useLedger } from "@/stores/useLedger";
import AmountViewer from "./AmountViewer";
import type { AmountViewerRef } from "./AmountViewer";

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
  const { record: recordInStore, inputMode } = useEditDraft();
  const ledgers = useLedger((store) => store.list);

  // refs
  const kindSelectorRef = useRef<KindSelectorRef>(null);
  const amountViewerRef = useRef<AmountViewerRef>(null);

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

  useEffect(() => {
    // TODO: when global setter is called, update components states
    // setContent((recordInStore?.value || 0).toFixed(2));
    recordRef.current = {
      ...recordRef.current,
      ...recordInStore,
    };
  }, [recordInStore]);

  const recordRef = useRef<BillAPI.DraftType>(defaultValue) as MutableRefObject<BillAPI.DraftType>;

  const { updateItem, addItem } = useBillRecords();
  const resetDraft = useEditDraft((state) => state.reset);

  /** 结算 */
  const onConfirm = async () => {
    const content = amountViewerRef.current!.amount;
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
        console.log("insert result:", res);
        if (res.data.code === 200) {
          id = res.data.data;
        }
        addItem({
          id,
          uid: useGuid().guid,
          ...recordRef.current,
        });
        if (res.data.code !== 200) {
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

    amountViewerRef.current?.setAmount("0");
    resetDraft();
    Taro.navigateBack();
  };

  const onDelete = () => {
    if (amountViewerRef.current?.amount.length === 1) {
      onReset();
    }
    else amountViewerRef.current?.setAmount((value) => value.slice(0, value.length - 1));
  };

  const onReset = () => {
    amountViewerRef.current?.setAmount("0");
    // TODO: submit but not close
  };

  const onInput = (key: string) => {
    const content = amountViewerRef.current!.amount;

    const currentNum = content.split(/[+]|-/).pop() || "0";
    if (key === ".") {
      // .
      if (currentNum.includes(".")) return;
      // else setContent(content => `${content}${currentNum === "0" ? "0." : key}`);
      else amountViewerRef.current?.setAmount((content) => content + key);
    } else if (key === "+" || key === "-") {
      // + -
      if (content === "0" || content === "0.00") return;
      if (content.endsWith("+"))
        amountViewerRef.current?.setAmount((content) => content.slice(0, content.length - 1) + "-");
      else if (content.endsWith("-"))
        amountViewerRef.current?.setAmount((content) => content.slice(0, content.length - 1) + "+");
      else {
        const res = evalExpOfTwo(content);
        amountViewerRef.current?.setAmount(() => res.toString() + key);
      }
    } else {
      // 1 2 3
      if (content === "0" || content === "0.00") amountViewerRef.current?.setAmount(key);
      else if (currentNum.includes(".") && currentNum.split(".")[1].length == 2)
        Taro.showToast({ title: "最多2位小数", icon: "none" });
      else if (
        !currentNum.includes(".") &&
        currentNum.split(".")[0].length === 8
      )
        Taro.showToast({ title: "最多8位整数", icon: "none" });
      else amountViewerRef.current?.setAmount((content) => content + key);
    }
  };

  const handleSelectKind = (e: { kind: string; type: string }) => {
    if (recordRef.current) {
      recordRef.current.type = e.type;
      recordRef.current.kind = e.kind;
    }
  };

  const handleInputRemark = useCallback((e: CommonEvent<InputEventDetail>) => {
    recordRef.current.remark = e.detail.value as string;
  }, []);

  return (
    <View>
      <KindSelector
        ref={kindSelectorRef}
        onSelect={handleSelectKind}
        defaultValue={{
          kind: recordRef.current?.kind,
          type: recordRef.current?.type,
        }}
      />
      <AmountViewer
        ref={amountViewerRef}
        defaultAmount={defaultValue?.value.toFixed(2)}
        defaultRemark={defaultValue?.remark}
        onInputRemark={handleInputRemark}
      />
      <MoreProperties record={recordRef} />
      { inputMode === 0 &&
        <NumberKeyboard
          onConfirm={onConfirm}
          onDelete={onDelete}
          onInput={onInput}
          onReset={onReset}
        />
      }
    </View>
  );
};

export default EditRecordPage;
