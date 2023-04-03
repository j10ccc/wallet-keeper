import Taro from "@tarojs/taro";
import request from "../request";

export const FetchShareCodeAPI = (params: LedgerAPI.FetchShareCode_Data) => {
  const token = JSON.parse(Taro.getStorageSync("userInfo")).state.token;
  return request<LedgerAPI.FetchShareCode_Result>("/api/ledger/query", {
    method: "GET",
    header: { Cookie: token },
    data: params,
  });
};
