import { View, Text } from "@tarojs/components";
import { useUser } from "@/stores/useUser";
import { AtAvatar, AtButton, AtCard } from "taro-ui";

import styles from "./index.module.scss";
import Taro from "@tarojs/taro";

const Nameplace = () => {
  const {
    username,
    gender,
    birthday,
    isLogin
  } = useUser();

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

  const handleLogin = async () => {
    Taro.navigateTo({
      url: "login/index"
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
