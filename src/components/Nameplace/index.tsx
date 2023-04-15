import { View, Text } from "@tarojs/components";
import { useUser } from "@/stores/useUser";
import { AtAvatar, AtIcon } from "taro-ui";
import Taro from "@tarojs/taro";
import useRequest from "@/hooks/useRequest";
import { LoginByWXAPI } from "@/services/public/LoginAPI";
import styles from "./index.module.scss";
import classNames from "classnames";
import { useLedger } from "@/stores/useLedger";
import LedgerService from "@/services/ledger";
import RecordService from "@/services/bill";
import { omit } from "lodash-es";
import { useBillRecords } from "@/stores/useBillRecords";
import dayjs from "dayjs";
import RecordUtils from "@/utils/RecordUtils";
import { useQueryBills } from "@/stores/useQueryBills";

const Nameplace = () => {
  const {
    username,
    gender,
    birthday,
    isLogin
  } = useUser();

  const { setUser, setIsLogin } = useUser();
  const ledgerStore = useLedger();
  const recordStore = useBillRecords();
  const { setLedgerID } = useQueryBills();

  const { run } = useRequest(LoginByWXAPI, {
    manual: true,
    onBefore: () => Taro.showLoading({title: "正在登录"}),
    onSuccess: (res) => {
      Taro.hideLoading();
      if (res.data.code === 200) {
        setUser({
          ...res.data.data,
          token: (res.cookies || []).join("; ")
        });
        setIsLogin(true);
        Taro.showToast({title: "登录成功", icon: "success"});
        syncWork();

      } else {
        Taro.showToast({
          title: `登录失败${res.data.msg || res.errMsg}`,
          icon: "none"
        });
      }
    },
    onError: () => Taro.hideLoading()
  });


  const syncWork = async () => {
    const ledgers = await syncLedger();
    setLedgerID(ledgers[0].id);
    ledgers.length && syncOfflineLedger(ledgers);
    ledgers.length && syncRecord(ledgers);
    // sync record
    // sync id = 0 ledger records to remote
  };

  const syncLedger = async () => {
    Taro.showLoading({
      title: "导入账本中"
    });
    let data: LedgerAPI.Ledger[] = [];

    try {
      const res = await LedgerService.FetchItemsAPI();
      // TODO: sync id = 0 ledger
      if (res.data.code === 200) {
        data = res.data.data.map(item => ({
          ...omit(item, "is_public"),
          isPublic: item.is_public
        }));
        ledgerStore.overwrite(data);
      } else {
        throw new Error(res.data.msg);
      }
      Taro.hideLoading();
    } catch (e) {
      Taro.hideLoading();
      Taro.showToast({
        icon: "none",
        title: e.message || "导入账本失败"
      });
    }
    return data;
  };

  const syncOfflineLedger = async (ledgers: LedgerAPI.Ledger[]) => {
    Taro.showLoading({
      title: "同步记账历史"
    });
    const res = await Promise.allSettled(
      recordStore.list.filter(item => item.ledgerID === 0).map(item => {
        return new Promise((resolve, reject) => {
          RecordService.InsertItemAPI({
            ...item,
            value: item.value.toFixed(2),
            type: item.type === "expense" ? true : false,
            ledger_id: ledgers[0].id,
          })
            .then(res => resolve(res.data.data))
            .catch(() => reject(item));
        });
      })
    );
    // delete data before deleting offline ledger
    recordStore.removeByLedger(0);
    ledgerStore.delete(0);
    // TODO: handle sync failed
    console.log(res);
    Taro.hideLoading();
  };

  const syncRecord = async (ledgers: LedgerAPI.Ledger[]) => {
    const res = await RecordUtils.getMergeData(
      dayjs().format("YYYY-MM"),
      "month",
      ledgers[0].id,
      recordStore.indexList,
      recordStore.list,
    );

    res.forEach(item => {
      recordStore.addItem(item);
    });

    // console.log(res ,diffRes);
  };

  const handleEnterProfile = () => {
    Taro.navigateTo({
      url: "profile/index",
    });
  };

  const handleRegister = async () => {
    Taro.navigateTo({
      url: "register/index"
    });
  };

  const handleClickClockin = () => {
    Taro.navigateTo({
      url: "/pages/clockin/index"
    });
  };

  const loginWX = async () => {
    const { code } = await Taro.login();
    run({ code });
  };

  const handleLogin = async () => {
    Taro.showModal({
      title: "选择",
      content: "是否使用微信登录",
      cancelText: "账号登录",
      success: (res) => {
        res.cancel && Taro.navigateTo({
          url: "login/index"
        });
        res.confirm && loginWX();
      },
    });
  };

  return (
    <View className={styles.container}>
      <View className={styles["avatar-wrapper"]}>
        <AtAvatar size="large" circle/>
      </View>

      { isLogin ?
        <>
          <View className={styles.header} onClick={handleEnterProfile}>
            <Text className={styles.username}>{ username }</Text>
          </View>

          <View className={styles.body}>
            <View className={styles.desc}>
              <Text className={styles.title}>性别</Text>
              <Text className={styles.content}>{ gender}</Text>
            </View>
            <View className={styles.desc}>
              <Text className={styles.title}>生日</Text>
              <Text className={styles.content}>{ birthday }</Text>
            </View>
          </View>
        </> :
        <View className={styles.header} onClick={handleEnterProfile}>
          <Text className={styles.username}>未登录</Text>
        </View>
      }
      <View className={styles.actions}>
        {
          isLogin ?
            <>
              <View style={{ flex: "auto"}} className={styles.button} onClick={handleEnterProfile}>
                <Text className={styles.label}>编辑</Text>
              </View>
              <View className={styles.clockin} onClick={handleClickClockin}>
                <AtIcon prefixClass="icon" value="clockin" size={18}/>
                <Text>签到</Text>
              </View>
            </> :
            <>
              <View
                style={{ flex: "0 50%" }}
                className={classNames([styles.button, styles.primary])}
                onClick={handleRegister}
              >
                <Text className={styles.label}>创建账号</Text>
              </View>
              <View style={{ flex: "0 50%" }}
                className={classNames([styles.button, styles.secondary])}
                onClick={handleLogin}
              >
                <Text className={styles.label}>登陆</Text>
              </View>
            </>
        }
      </View>
    </View>
  );
};

export default Nameplace;
