import Taro from "@tarojs/taro";
import request from "../request";

export const DeleteItemAPI = (params: LedgerAPI.DeleteItem_Data) => {
  const token = JSON.parse(Taro.getStorageSync("userInfo")).state.token;
  return request<LedgerAPI.DeleteItem_Result>(`/api/ledger/${params.id}`, {
    method: "DELETE",
    header: { Cookie: token },
  });
};
