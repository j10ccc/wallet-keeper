import PageView from "@/components/PageView";
import useRequest from "@/hooks/useRequest";
import { View, Text, ScrollView } from "@tarojs/components";
import LedgerService from "@/services/ledger";
import classNames from "classnames";
import Taro from "@tarojs/taro";
import { useQueryBills } from "@/stores/useQueryBills";
import { useLedger } from "@/stores/useLedger";
import styles from "./index.module.scss";
import { omit } from "lodash-es";
import LedgerSelector from "@/components/LedgerSelector";
import { AtIcon } from "taro-ui";
import { useUser } from "@/stores/useUser";

const LedgerManagerPage = () => {
  const { ledgerID, setLedgerID } = useQueryBills();
  const { overwrite, list: ledgers } = useLedger();
  const userStore = useUser();

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
    if (!userStore.isLogin) {
      Taro.showModal({
        title: "提示",
        content: "使用多账本功能需要登陆小二账号",
        confirmText: "去登陆",
        cancelText: "离线使用",
        success: () => {
          Taro.switchTab({
            url: "/pages/assets/index"
          });
        },
        fail: () => { /** */ }
      });
      return;
    }

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

  const handleLedgerSelect = (ledger: LedgerAPI.Ledger) => {
    setLedgerID(ledger.id);
    Taro.navigateBack();
  };

  return (
    <PageView>
      <ScrollView style={{ flex: "auto", backgroundColor: "#f0f0f0" }}>
        <LedgerSelector
          onSelect={handleLedgerSelect}
          ledgers={ledgers}
          defaultSelectId={ledgerID || ledgers[0].id}
        />
        <View
          className={classNames([styles.card, styles["add-btn"]])}
          onClick={handleAdd}
        >
          <AtIcon prefixClass="icon" value="add" />
          <Text>添加</Text>
        </View>
      </ScrollView>
    </PageView>
  );
};

export default LedgerManagerPage;
