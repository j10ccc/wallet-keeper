import { View } from "@tarojs/components";
import NumberKeyboard from "@/components/NumberKeyboard";
import { useState } from "react";
import Taro from "@tarojs/taro";
import PageView from "@/components/PageView";
import { AtTabs, AtTabsPane } from "taro-ui";
import RecordTypeList from "./RecordTypeList";
import ContentPreview from "./ContentPreview";
import ExtentsionsListBar from "./ExtensionListBar";
import { expenseItemList, incomeItemList } from "../constants/RecordItemList";
import { useInputDraft } from "@/stores/useInputDraft";
import { useBillRecords } from "@/stores/useBillRecords";
import { useGuid } from "@/hooks/useGuid";

const tabList = [
  { title: "支出", value: "expense" },
  { title: "收入", value: "income"},
];

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
  return res;
};

const InputPage = () => {
  const [content, setContent] = useState("0.00");
  const [tabIndex, setTabIndex] = useState(0);
  const { addItem } = useBillRecords();

  const {
    date,
    kind,
    type,
    setKind,
    setValue,
    setType,
    resetDraft,
  } = useInputDraft();

  // TODO: 数字过长
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
        setValue(res);
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

  const onConfirm = () => {
    const res = evalExpOfTwo(content);
    setValue(res);
    setContent("0");
    // console.log(value, kind, type, date);
    addItem({
      uid: useGuid().guid,
      value: res,
      kind,
      type,
      date
    });
    resetDraft();
  };

  const onDelete = () => {
    if (content.length === 1) setContent("0");
    else setContent(value => value.slice(0, value.length - 1));
  };

  const onReset = () => {
    setContent("0");
    // TODO: submit but not close
    resetDraft();
  };

  const handleChangeTab = (index: number) => {
    setTabIndex(index);
    setKind(tabList[index].value);
    if (tabList[index].value === "expense")
      setType(expenseItemList[0].value);
    else
      setType(incomeItemList[0].value);
  };

  return <PageView>
    <View style={{ flex: "1" }}>
      <AtTabs
        tabList={tabList}
        onClick={handleChangeTab}
        current={tabIndex}
        scroll
      >
        <AtTabsPane index={0} current={tabIndex}>
          <RecordTypeList list={expenseItemList}/>
        </AtTabsPane>
        <AtTabsPane index={1} current={tabIndex}>
          <RecordTypeList list={incomeItemList}/>
        </AtTabsPane>
      </AtTabs>
    </View>
    <ContentPreview content={content} />
    <ExtentsionsListBar />
    <NumberKeyboard
      onConfirm={onConfirm}
      onDelete={onDelete}
      onInput={onInput}
      onReset={onReset}
    />
  </PageView>;
};

export default InputPage;
