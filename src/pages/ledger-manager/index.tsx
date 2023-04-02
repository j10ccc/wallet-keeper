import PageView from "@/components/PageView";
import useRequest from "@/hooks/useRequest";
import { View, Text, ScrollView } from "@tarojs/components";
import LedgerService from "@/services/ledger";
import classNames from "classnames";
import Taro from "@tarojs/taro";
import { AtIcon } from "taro-ui";
import { useQueryBills } from "@/stores/useQueryBills";

import styles from "./index.module.scss";
import { useLedger } from "@/stores/useLedger";

const LedgerCard = (props: { name: string; id: number; selected: boolean }) => {
  const { setLedgerID } = useQueryBills();

  const handleSelect = () => {
    // TODO: set store state
    setLedgerID(props.id);
    console.log(props.id);
    Taro.navigateBack();
  };

  const handleEdit = (e) => {
    console.log(e.stopPropagation());
  };

  return (
    <View className={styles.card} onClick={handleSelect}>
      {props.selected && (
        <View className={styles.select}>
          <AtIcon prefixClass="icon" value="ok" size={20} />
        </View>
      )}
      <Text className={styles.name}>{props.name}</Text>
      <View className={styles.more} onClick={handleEdit}>
        <AtIcon prefixClass="icon" value="more" />
      </View>
    </View>
  );
};

const LedgerManagerPage = () => {
  const { ledgerID } = useQueryBills();
  const { overwrite } = useLedger();

  const getLedgers = useRequest(LedgerService.FetchItemsAPI, {
    onSuccess: (response) => {
      if (response.data.code === 200) {
        overwrite(
          response.data.data.map((item) => ({
            ...item,
            isPublic: true,
          }))
        );
      }
    },
  });

  const handleAdd = () => {
    Taro.showActionSheet({
      itemList: ["创建账本", "加入他人账本"],
      success: (e) => {
        if (e.tapIndex === 0) {
          Taro.navigateTo({
            url: "create/index",
          });
        }
      },
      fail: (e) => {
        console.log(e);
      },
    });
  };

  return (
    <PageView>
      <ScrollView style={{ flex: "auto", backgroundColor: "#f0f0f0" }}>
        <View className={styles["ledgers-grid"]}>
          {getLedgers.data?.data.map((item) => (
            <LedgerCard
              key={item.id}
              name={item.name}
              id={item.id}
              selected={ledgerID === item.id}
            />
          ))}
          <View
            className={classNames([styles.card, styles["add-btn"]])}
            onClick={handleAdd}
          >
            <Text>添加</Text>
          </View>
        </View>
      </ScrollView>
    </PageView>
  );
};

export default LedgerManagerPage;
