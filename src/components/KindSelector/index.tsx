import { ScrollView, View, Text } from "@tarojs/components";
import { AtIcon, AtTabs, AtTabsPane } from "taro-ui";
import styles from "./index.module.scss";
import { forwardRef, useEffect, useState, useImperativeHandle, useContext } from "react";
import {
  expenseItemList as defaultExpenseItems,
  incomeItemList as defaultIncomeItems,
  RecordKindType
} from "@/constants/RecordItemList";
import classnames from "classnames";
import EditContext from "@/pages/edit-record/EditContext";
import LedgerUtils from "@/utils/LedgerUtils";
import { useLedger } from "@/stores/useLedger";

const tabList = [
  { title: "支出", value: "expense" },
  { title: "收入", value: "income" },
];

export type KindSelectorRef = {
  setSelectorState: (kind: string, type: "expense" | "income") => void;
  reset: (expenseList?: RecordKindType[], incomeList?: RecordKindType[]) => void;
}

type PropsType = {
  defaultValue?: BillAPI.DraftType
};

const KindSelector = forwardRef<KindSelectorRef, PropsType>((props: PropsType, ref) => {
  const { defaultValue } = props;
  const [kind, setKind] = useState(defaultExpenseItems[0].value);
  const ledgers = useLedger(store => store.list);
  const [tabIndex, setTabIndex] = useState(
    !defaultValue?.type || defaultValue?.type === "expense" ? 0 : 1
  );

  const defaultTemplate = LedgerUtils.getTemplate(
    LedgerUtils.getLedger(defaultValue?.ledgerID, ledgers
    ));
  const [expenseList, setExpenseList] = useState(
    defaultTemplate.expenseKinds || defaultExpenseItems
  );
  const [incomeList, setIncomeList] = useState(
    defaultTemplate.incomeKinds || defaultIncomeItems
  );
  const { recordRef } = useContext(EditContext);
  console.log("kind selector render");

  useImperativeHandle(ref, () => {
    const setSelectorState = (kind: string, type: "expense" | "income") => {
      if (type === "expense") {
        setTabIndex(0);
        setTabIndex(0);
      } else if (type === "income"){
        setTabIndex(1);
        setTabIndex(1);
      }
      const realKind =
        (type === "expense" ? expenseList : incomeList)
          .find(item => item.value === kind)?.value;

      setKind(realKind || expenseList[0].value);
      setTabIndex(type === "expense" ? 0: 1);
    };

    /**
     * Reset kind list
     *
     * if not pass property then use default kind list
     */
    const reset = (
      expenseList?: RecordKindType[],
      incomeList?: RecordKindType[],
    ) => {
      setExpenseList(expenseList || defaultExpenseItems);
      setIncomeList(incomeList || defaultIncomeItems);
      setKind((expenseList || defaultExpenseItems)[0].value);
      setTabIndex(0);
      recordRef!.current.kind = (expenseList || defaultExpenseItems)[0].value;
      recordRef!.current.type = "expense";
    };

    return {
      setSelectorState,
      reset
    };
  });

  useEffect(() => {
    if (defaultValue?.kind) {
      setKind(defaultValue.kind);
    }
    if (defaultValue?.type) {
      setTabIndex(defaultValue?.type === "expense" ? 0 : 1);
    }
  }, []);

  const handleChangeTab = (index: number) => {
    setTabIndex(index);
    if (tabList[index].value === "expense") {
      recordRef!.current.type = "expense";
      recordRef!.current.kind = expenseList[0].value;
      setKind(expenseList[0].value);
    }
    else {
      recordRef!.current.type = "income";
      recordRef!.current.kind = incomeList[0].value;
      setKind(incomeList[0].value);
    }

  };

  const handleClickKind = (kind: string, type: string) => {
    // FIXME:
    setKind(kind);
    recordRef!.current.kind = kind;
    recordRef!.current.type = type as "income" | "expense";

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
            {expenseList.map((item) => (
              <View
                key={item.label}
                className={classnames([styles.item, styles.expense])}
                onClick={() => handleClickKind(item.value, "expense")}
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
            {incomeList.map((item) => (
              <View
                key={item.label}
                className={classnames([styles.item, styles.income])}
                onClick={() => handleClickKind(item.value, "income")}
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
