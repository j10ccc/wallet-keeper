import PageView from "@/components/PageView";
import useRequest from "@/hooks/useRequest";
import { View, Text, ScrollView } from "@tarojs/components";
import LedgerService from "@/services/ledger";
import classNames from "classnames";
import Taro from "@tarojs/taro";
import { AtIcon } from "taro-ui";
import { useQueryBills } from "@/stores/useQueryBills";
import { useLedger } from "@/stores/useLedger";
import styles from "./index.module.scss";
import { useUser } from "@/stores/useUser";
import { useState } from "react";
import { ledgerTemplateList } from "@/constants/LedgerTemplateList";
import { omit } from "lodash-es";

const LedgerCard = (props: {
  ledger: LedgerAPI.Ledger;
  selected: boolean;
}) => {
  const { setLedgerID } = useQueryBills();
  const { ledger, selected } = props;
  const userStore = useUser();
  const [icon] = useState(() => {
    if (ledger.template === "default") return null;
    else {
      return ledgerTemplateList.find(item =>
        item.name === ledger.template
      )!;
    }
  });

  const handleSelect = () => {
    // TODO: set store state
    setLedgerID(ledger.id);
    console.log(ledger.id);
    Taro.navigateBack();
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    Taro.navigateTo({
      url: `update/index?id=${ledger.id}`,
    });
  };

  return (
    <View className={styles.card} onClick={handleSelect}>
      {selected && (
        <View className={styles.select}>
          <AtIcon prefixClass="icon" value="ok" size={20} />
        </View>
      )}
      { icon !== null
        && <View className={styles["template-icon"]}>
          <AtIcon prefixClass="icon"
            value={`ledger-${icon.icon}`}
            color={icon.color}
            size={48}
          />
        </View>
      }
      <Text className={styles.name}>{ledger.name}</Text>
      { ledger.isPublic
        && <View className={styles["share-tag"]}>共享</View>
      }
      { ledger.owner === userStore.username
        && <View className={styles.more} onClick={handleEdit}>
          <AtIcon prefixClass="icon" value="more" />
        </View>
      }
    </View>
  );
};

const LedgerManagerPage = () => {
  const { ledgerID } = useQueryBills();
  const { overwrite, list: ledgers } = useLedger();

  useRequest(LedgerService.FetchItemsAPI, {
    onSuccess: (response) => {
      if (response.data.code === 200) {
        overwrite(
          response.data.data.map((item) => ({
            ...omit(item, ["is_public"]),
            isPublic: item.is_public || false
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
        } else if ( e.tapIndex === 1) {
          Taro.navigateTo({
            url: "join/index"
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
          {ledgers.map((item) => (
            <LedgerCard
              ledger={item}
              key={item.id}
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
