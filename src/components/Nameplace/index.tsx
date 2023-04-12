import { View, Text } from "@tarojs/components";
import { useUser } from "@/stores/useUser";
import { AtAvatar, AtIcon } from "taro-ui";
import Taro from "@tarojs/taro";
import useRequest from "@/hooks/useRequest";
import { LoginByWXAPI } from "@/services/public/LoginAPI";
import styles from "./index.module.scss";
import classNames from "classnames";

const Nameplace = () => {
  const {
    username,
    gender,
    birthday,
    isLogin
  } = useUser();

  const { setUser, setIsLogin} = useUser();

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
      } else {
        Taro.showToast({
          title: `登录失败${res.data.msg || res.errMsg}`,
          icon: "none"
        });
      }
    },
    onError: () => Taro.hideLoading()
  });

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
