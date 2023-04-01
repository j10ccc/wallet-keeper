import Taro from "@tarojs/taro";
import request from "../request";

export const FetchItemsAPI = (data: BillAPI.FetchItems_Data) => {
  const token = JSON.parse(Taro.getStorageSync("userInfo")).state.token;
  return request<BillAPI.FetchItems_Result>("/api/expenses", {
    method: "GET",
    header: { Cookie: token },
    data,
  });
};
