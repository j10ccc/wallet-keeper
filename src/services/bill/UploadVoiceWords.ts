import Taro from "@tarojs/taro";
import request from "../request";

export const UploadVoiceWordsAPI = (data: BillAPI.UploadVoiceWords_Data) => {
  const token = JSON.parse(Taro.getStorageSync("userInfo")).state.token;
  return request<BillAPI.UploadVoiceWords_Result>(
    "/api/expenses/voice", {
      method: "POST",
      header: { "Cookie": token },
      data
    });
};
