import Taro from "@tarojs/taro";
import request from "../request";

export const CreateItemAPI = (data: LedgerAPI.CreateItem_Data) => {
  const token = JSON.parse(Taro.getStorageSync("userInfo")).state.token;
  return request<LedgerAPI.CreateItem_Result>("/api/ledger", {
    method: "POST",
    header: { Cookie: token },
    data: data,
  });
};
