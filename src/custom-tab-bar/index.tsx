import Taro from "@tarojs/taro";
import { useTab } from "../stores/useTab";
import { View, Text } from "@tarojs/components";

import styles from "./index.module.scss";
import { AtIcon } from "taro-ui";
import classNames from "classnames";
import "@/styles/icons.scss";

const tabList = [
  { title: "账单", iconType: "list", path: "/pages/index/index" },
  { title: "记一笔", iconType: "add", path: "/pages/input/index" },
  { title: "资产", iconType: "card", path: "/pages/assets/index" },
];

const TabBar = () => {
  const { tabIndex, setCurrentTabIndex } = useTab((state) => ({
    tabIndex: state.tabIndex,
    setCurrentTabIndex: state.setTabIndex,
  }));

  const handleChangeTab = (value: number) => {
    setCurrentTabIndex(value);
    Taro.switchTab({ url: tabList[value].path });
  };

  const handleClickAdd = () => {
    Taro.navigateTo({
      url: "/pages/edit-record/index",
    });
  };

  return (
    <View className={styles["tab-bar"]}>
      {tabList.map((item, index) => {
        if (index === 1) {
          return (
            <View
              key={item.title}
              className={styles.add}
              onClick={handleClickAdd}
            >
              <AtIcon prefixClass="icon" value={item.iconType} size={24} />
            </View>
          );
        } else
          return (
            <View
              className={classNames([
                styles.item,
                tabIndex === index ? styles.selected : undefined,
              ])}
              key={item.title}
              onClick={() => handleChangeTab(index)}
            >
              <View className={styles.icon}>
                <AtIcon prefixClass="icon" value={item.iconType} />
              </View>
              <Text className={styles.name}>{item.title}</Text>
            </View>
          );
      })}
    </View>
  );
};

export default TabBar;
