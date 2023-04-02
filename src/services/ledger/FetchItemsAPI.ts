import Taro from "@tarojs/taro";
import request from "../request";

export const FetchItemsAPI = () => {
  const token = JSON.parse(Taro.getStorageSync("userInfo")).state.token;
  return request<LedgerAPI.FetchItem_Result>("/api/ledger", {
    method: "GET",
    header: { Cookie: token },
  });
};
