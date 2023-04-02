import Taro from "@tarojs/taro";
import request from "../request";

export const UpdateItemAPI = (data: LedgerAPI.UpdateItem_Data) => {
  const token = JSON.parse(Taro.getStorageSync("userInfo")).state.token;
  return request<LedgerAPI.UpdateItem_Result>("/api/ledger", {
    method: "PUT",
    header: { Cookie: token },
    data: data,
  });
};
