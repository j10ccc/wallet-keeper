import Taro from "@tarojs/taro";
import { AtTabBar } from "taro-ui";
import { useTab } from "../stores/useTab";

import "./index.scss";

const tabList = [
  { title: "账单", iconType: "bullet-list", path: "/pages/index/index"},
  { title: "记一笔", iconType: "edit", path: "/pages/input/index"},
  { title: "资产", iconType: "credit-card", path: "/pages/assets/index" },
];

const TabBar = () => {
  const { tabIndex, setCurrentTabIndex } = useTab(state => ({
    tabIndex: state.tabIndex,
    setCurrentTabIndex: state.setTabIndex
  }));

  const handleChangeTab = (value: number) => {
    setCurrentTabIndex(value);
    Taro.switchTab({ url: tabList[value].path});
  };

  return (
    <AtTabBar
      tabList={tabList}
      current={tabIndex}
      onClick={handleChangeTab}
      fixed
    />
  );
};

export default TabBar;
