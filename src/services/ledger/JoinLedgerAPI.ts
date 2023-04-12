import Taro from "@tarojs/taro";
import request from "../request";

export const JoinLedgerAPI = (params: LedgerAPI.JoinLedger_Data) => {
  const token = JSON.parse(Taro.getStorageSync("userInfo")).state.token;
  return request<LedgerAPI.JoinLedger_Result>(
    `/api/ledger/join?password=${params.code}`, {
      method: "POST",
      header: { Cookie: token },
    });
};
