import { View, Text } from "@tarojs/components";
import { useUser } from "@/stores/useUser";
import { AtAvatar, AtButton, AtCard } from "taro-ui";
import Taro from "@tarojs/taro";
import useRequest from "@/hooks/useRequest";
import { LoginByWXAPI } from "@/services/public/LoginAPI";
import styles from "./index.module.scss";

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
    <AtCard title="个人信息">
      {isLogin ?
        <View>
          <View className={styles.primary} onClick={handleEnterProfile}>
            <AtAvatar />
            <Text className={styles.username}>{ username }</Text>
          </View>
          <View className={styles.secondary}>
            <View className={styles.desc}>
              <Text className={styles.title}>性别</Text>
              <Text className={styles.content}>{ gender}</Text>
            </View>
            <View className={styles.desc}>
              <Text className={styles.title}>生日</Text>
              <Text className={styles.content}>{ birthday }</Text>
            </View>
          </View>
        </View> :
        <View>
          <AtButton type="primary" size="small" onClick={handleLogin}>登录</AtButton>
          <AtButton size="small" onClick={handleRegister}>注册</AtButton>
        </View>
      }
    </AtCard>
  );
};

export default Nameplace;
