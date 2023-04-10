import { ScrollView, View, Text } from "@tarojs/components";
import { AtIcon, AtTabs, AtTabsPane } from "taro-ui";
import styles from "./index.module.scss";
import { forwardRef, useEffect, useState, useImperativeHandle } from "react";
import { expenseItemList, incomeItemList } from "@/constants/RecordItemList";
import classnames from "classnames";

const tabList = [
  { title: "支出", value: "expense" },
  { title: "收入", value: "income" },
];

export type KindSelectorRef = {
  setSelectorState: (kind: string, type: "expense" | "income") => void;
}

type PropsType = {
  defaultValue?: { kind?: string; type?: string };
  onSelect: (e: { kind: string; type: string }) => void;
};

const KindSelector = forwardRef<KindSelectorRef, PropsType>((props: PropsType, ref) => {
  const { defaultValue, onSelect } = props;
  const [kind, setKind] = useState(expenseItemList[0].value);
  const [tabIndex, setTabIndex] = useState(
    defaultValue?.type === "expense" ? 0 : 1
  );
  const [type, setType] = useState("expense");


  useImperativeHandle(ref, () => {
    const setSelectorState = (kind: string, type: "expense" | "income") => {
      if (type === "expense") {
        setTabIndex(0);
        setTabIndex(0);
      } else if (type === "income"){
        setTabIndex(1);
        setTabIndex(1);
      }
      handleSelect(kind);
    };

    return {
      setSelectorState
    };
  });

  useEffect(() => {
    if (defaultValue?.kind) {
      setKind(defaultValue.kind);
    }
    if (defaultValue?.type) {
      setTabIndex(defaultValue?.type === "expense" ? 0 : 1);
      setType(defaultValue.type);
    }
  }, []);

  const handleChangeTab = (index: number) => {
    setTabIndex(index);
    setType(tabList[index].value);
    if (tabList[index].value === "expense") setKind(expenseItemList[0].value);
    else setKind(incomeItemList[0].value);
  };

  const handleSelect = (kind: string) => {
    setKind(kind);
    onSelect({ kind, type });
  };

  return (
    <AtTabs
      tabList={tabList}
      onClick={handleChangeTab}
      current={tabIndex}
      scroll
    >
      <AtTabsPane index={0} current={tabIndex}>
        <ScrollView scrollY enableFlex className={styles["tab-scroll-view"]}>
          <View className={styles.container}>
            {expenseItemList.map((item) => (
              <View
                key={item.label}
                className={classnames([styles.item, styles.expense])}
                onClick={() => handleSelect(item.value)}
              >
                <View
                  className={classnames(styles["icon-wrapper"], {
                    [styles["icon-wrapper-selected"]]: kind === item.value,
                  })}
                >
                  <AtIcon
                    className={styles.icon}
                    prefixClass="icon"
                    value={item.value}
                  />
                </View>
                <Text className={styles.label}>{item.label}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </AtTabsPane>
      <AtTabsPane index={1} current={tabIndex}>
        <ScrollView scrollY enableFlex className={styles["tab-scroll-view"]}>
          <View className={styles.container}>
            {incomeItemList.map((item) => (
              <View
                key={item.label}
                className={classnames([styles.item, styles.income])}
                onClick={() => handleSelect(item.value)}
              >
                <View
                  className={classnames(styles["icon-wrapper"], {
                    [styles["icon-wrapper-selected"]]: kind === item.value,
                  })}
                >
                  <AtIcon
                    className={styles.icon}
                    prefixClass="icon"
                    value={item.value}
                  />
                </View>
                <Text className={styles.label}>{item.label}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </AtTabsPane>
    </AtTabs>
  );
});

KindSelector.displayName = "KindSelector";

export default KindSelector;
