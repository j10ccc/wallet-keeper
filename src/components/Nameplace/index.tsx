import { View, Text } from "@tarojs/components";
import { useUser } from "../../stores/useUser";
import { AtAvatar, AtButton, AtCard } from "taro-ui";
import { RegisterAPI } from "@/services/public/RegisterAPI";

const Nameplace = () => {
  const { username, isLogin } = useUser();

  const handleRegister = async () => {
    const res = await RegisterAPI({
      username: "12313",
      password: "213123",
      gender: "sdaf",
      birthday: "21313",
    });

  };

  return (
    <AtCard title="个人信息">
      {
        isLogin ?
          <View>
            <AtAvatar />
            <Text>{ username }</Text>
          </View> :
          <View>
            <AtButton type="primary" size="small">登录</AtButton>
            <AtButton size="small" onClick={handleRegister}>注册</AtButton>
          </View>
      }

    </AtCard>
  );
};

export default Nameplace;
