import Taro from "@tarojs/taro";
import request from "../request";

export const DeleteItemAPI = (data: BillAPI.DeleteItem_Data) => {
  const token = JSON.parse(Taro.getStorageSync("userInfo")).state.token;
  return request<BillAPI.DeleteItem_Result>(
    `/api/expenses/delete${data.id}`, {
      method: "DELETE",
      header: { "Cookie": token },
    });
};
