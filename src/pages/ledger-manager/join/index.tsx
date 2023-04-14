import FormPageHeader from "@/components/FormPageHeader";
import PageView from "@/components/PageView";
import { View, Text } from "@tarojs/components";
import { useRef } from "react";
import { AtForm, AtInput } from "taro-ui";
import LedgerService from "@/services/ledger";
import styles from "./index.module.scss";
import Taro from "@tarojs/taro";
import { useLedger } from "@/stores/useLedger";
import { omit } from "lodash-es";

type FormData = {
  code: string;
}

const JoinLedgerPage = () => {
  const ledgerStore = useLedger();

  const formData = useRef<FormData>({
    code: "",
  });

  const handleChangeCode = (value: string) => {
    formData.current.code = value;
    // const
  };

  const refreshLedgers = async () => {
    try {
      const res = await LedgerService.FetchItemsAPI();
      if (res.data.code === 200) {
        ledgerStore.overwrite(
          res.data.data.map(item => ({
            ...omit(item, ["is_public"]),
            isPublic: item.is_public || false
          }))
        );
        Taro.navigateBack();
      } else {
        throw new Error(res.data.msg);
      }
    } catch (e) {
      console.log(e);
    }

  };

  const handleFinish = async () => {
    console.log(formData.current);
    Taro.showLoading({
      title: "正在加入账本"
    });
    try {
      const res = await LedgerService.JoinLedgerAPI(formData.current);
      if (res.data.code === 200) {
        await refreshLedgers();
        Taro.hideToast();
      } else {
        throw new Error(res.data.msg);
      }
      console.log(res);
    } catch (e) {
      Taro.hideToast();
      Taro.showToast({
        icon: "error",
        title: e.message
      });

    }
  };

  return (
    <PageView>
      <FormPageHeader title="加入他人账本" />
      <View className={styles.container}>
        <AtForm>
          <AtInput
            name="code"
            onChange={ handleChangeCode }
            title="账本密钥"
            required
          >
            <View className={styles.confirm} onClick={handleFinish}>
              <Text>加入</Text>
            </View>
          </AtInput>
        </AtForm>
      </View>
    </PageView>
  );

};

export default JoinLedgerPage;
