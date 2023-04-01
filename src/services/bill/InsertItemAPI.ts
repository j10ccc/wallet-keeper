import Taro from "@tarojs/taro";
import request from "../request";

export const InsertItemAPI = (data: BillAPI.InsertItem_Data) => {
  const token = JSON.parse(Taro.getStorageSync("userInfo")).state.token;
  return request<BillAPI.InsertItem_Result>("/api/expenses", {
    method: "POST",
    header: { Cookie: token },
    data,
  });
};
