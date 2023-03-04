import useEnv from "@/hooks/useEnv";
import Taro from "@tarojs/taro";

export const UploadPhotoAPI = (data: Bill.UploadPhoto_Data) => {
  const requestUrl: { [key: string]: string } = {
    default: "/api/expenses/photo",
    train: "/api/expenses/train_tickets"
  };
  const token = JSON.parse(Taro.getStorageSync("userInfo")).state.token;

  Taro.uploadFile({
    url: `${useEnv().baseUrl}${requestUrl[data.type || "default"]}`,
    filePath: data.filePath,
    name: "photo",
    header: { Cookie: token },
    success: (res) => {
      console.log(res);
    }
  });
};
