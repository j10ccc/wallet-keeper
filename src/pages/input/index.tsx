import { View } from "@tarojs/components";
import NumberKeyboard from "@/components/NumberKeyboard";
import { useCallback, useState } from "react";
import { useEffect } from "react";
import Taro from "@tarojs/taro";
import PageView from "@/components/PageView";
import { AtTabs, AtTabsPane } from "taro-ui";
import RecordTypeList from "./RecordTypeList";

const tabList = [
  { title: "支出" },
  { title: "收入" },
];

export type RecordTypeItem = {
  label: string;
  value: string; // consist with iconName
}

const consumeItemList: RecordTypeItem[] = [
  {label: "三餐", value: "meals"},
  {label: "日用品", value: "daily"},
  {label: "交通", value: "transit"},
  {label: "零食", value: "food"},
  {label: "衣服", value: "clothes"},
  {label: "发红包", value: "redenvelope"},
  {label: "运动", value: "sports"},
  {label: "话费网费", value: "calls"},
  {label: "旅游", value: "trip"},
  {label: "宠物", value: "pets"},
  {label: "学习", value: "school"},
  {label: "医疗", value: "treatment"},
  {label: "娱乐", value: "fun"},
  {label: "住房", value: "house"},
  {label: "电器数码", value: "digit"},
  {label: "汽车/加油", value: "oil"},
  {label: "美妆", value: "makeup"},
  {label: "其他", value: "other"},
];

const incomeItemList: RecordTypeItem[] = [
  {label: "工资", value: "salary"},
  {label: "生活费", value: "alimony"},
  {label: "收红包", value: "redenvelope"},
  {label: "股票基金", value: "stock"},
  {label: "其他", value: "other"},
];

const InputPage = () => {
  const [content, setContent] = useState("0");
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    console.log(content);
  }, [content]);

  const onConfirm = useCallback(() => {
    setContent("0");
  }, [content]);

  const onInput = useCallback((key: string) => {
    const currentNum = content.split(/[+]|-/).pop() || "0";
    console.log("currentNum" ,currentNum);
    if (key === ".") {
      // .
      if (currentNum.includes(".")) return;
      // else setContent(content => `${content}${currentNum === "0" ? "0." : key}`);
      else setContent(content => content + key);
    } else if (key === "+" || key === "-") {
      // + -
      if (content.endsWith("+"))
        setContent(content => content.slice(0, content.length - 1) + "-");
      else if (content.endsWith("-"))
        setContent(content => content.slice(0, content.length - 1) + "+");
      else setContent(content => content + key);
    } else {
      // 1 2 3
      if (content === "0") setContent(key);
      else if (currentNum.includes(".") && currentNum.split(".")[1].length == 2)
        Taro.showToast({title: "最多2位小数", icon:"none"});
      else setContent(content => content + key);
    }

  }, [content]);

  const onDelete = useCallback(() => {
    if (content.length === 1) setContent("0");
    else setContent(value => value.slice(0, value.length - 1));
  }, [content]);

  const onReset = useCallback(() => {
    setContent("0");
  }, []);

  const handleChangeTab = (index: number) => {
    setTabIndex(index);
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
          <RecordTypeList list={consumeItemList}/>
        </AtTabsPane>
        <AtTabsPane index={1} current={tabIndex}>
          <RecordTypeList list={incomeItemList}/>
        </AtTabsPane>
      </AtTabs>
    </View>
    <NumberKeyboard
      onConfirm={onConfirm}
      onDelete={onDelete}
      onInput={onInput}
      onReset={onReset}
    />
  </PageView>;
};

export default InputPage;
