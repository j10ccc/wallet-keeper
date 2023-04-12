import Taro from "@tarojs/taro";
import UserService from "@/services/user";

const refreshUserToken = async () => {
  const { code } = await Taro.login();

  const res = await UserService.RefreshTokenAPI({ code });
  return (res.cookies || []).join("; ");
};

export default {
  refreshUserToken
};
