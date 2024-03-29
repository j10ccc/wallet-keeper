import Taro from "@tarojs/taro";
import request from "../request";

export const UpdateItemAPI = (data: BillAPI.UpdateItem_Data) => {
  const token = JSON.parse(Taro.getStorageSync("userInfo")).state.token;
  return request<BillAPI.UpdateItem_Result>("/api/expenses", {
    method: "PUT",
    header: { Cookie: token },
    data,
  });
};
