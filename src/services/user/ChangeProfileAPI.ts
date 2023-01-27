import request from "../request";
import Taro from "@tarojs/taro";

export const ChangePasswordAPI = (data: User.ChangePassword_Data) => {
  const token = JSON.parse(Taro.getStorageSync("userInfo")).state.token;
  return request<User.ChangePassword_Result>(
    "/api/user/change/password", {
      method: "POST",
      header: { "Cookie": token },
      data
    },
  );
};

export const ChangeGenderAPI = (data: User.ChangeGender_Data) => {
  const token = JSON.parse(Taro.getStorageSync("userInfo")).state.token;
  return request<User.ChangeGender_Result>(
    "/api/user/change/gender", {
      method: "GET",
      header: { "Cookie": token },
      data
    },
  );
};

export const ChangeBirthdayAPI = (data: User.ChangeBirthday_Data) => {
  const token = JSON.parse(Taro.getStorageSync("userInfo")).state.token;
  return request<User.ChangeBirthday_Result>(
    "/api/user/change/birthday", {
      method: "GET",
      header: { "Cookie": token },
      data
    },
  );
};
