import { View, Text } from "@tarojs/components";
import { useUser } from "@/stores/useUser";
import { AtAvatar, AtButton, AtCard } from "taro-ui";
import { RegisterAPI } from "@/services/public/RegisterAPI";
import useRequest from "@/hooks/useRequest";

const Nameplace = () => {
  const initialData = {
    username: "manual",
    password: "213123",
    gender: "sdaf",
    birthday: "21313",
  };
  const {
    userInfo,
    setIsLogin,
    setToken,
  } = useUser();

  const { run } = useRequest(
    RegisterAPI, {
      manual: true,
      onSuccess: ((response) => {
        console.log(response);
        if (response.cookies && response.cookies?.length !== 0) {
          setIsLogin(true);
          setToken(response.cookies[0]);
          // setGender(initialData.gender);
          // setUsername(initialData.username);
          // setBirthday(initialData.gender);
        }
      })
    });

  const handleRegister = async () => {
    run({ ...initialData });
  };

  return (
    <AtCard title="个人信息">
      {userInfo.isLogin ?
        <View>
          <AtAvatar />
          <Text>{ userInfo.username } { userInfo.gender }</Text>
          <View>
            <Text>生日</Text>
            <Text>{ userInfo.birthday }</Text>
          </View>
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
