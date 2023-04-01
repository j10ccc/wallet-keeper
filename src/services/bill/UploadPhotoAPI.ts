import useEnv from "@/hooks/useEnv";
import Taro from "@tarojs/taro";

export const UploadPhotoAPI = async (data: BillAPI.UploadPhoto_Data) => {
  const requestUrl: { [key: string]: string } = {
    default: "/api/expenses/photo",
    train: "/api/expenses/train_ticket",
  };
  const token = JSON.parse(Taro.getStorageSync("userInfo")).state.token;

  return new Promise<BillAPI.UploadPhoto_Result>((resolve) => {
    Taro.uploadFile({
      url: `${useEnv().baseUrl}${requestUrl[data.type || "train"]}`,
      filePath: data.filePath,
      name: "photo",
      header: { Cookie: token },
      success: (res) => {
        resolve(JSON.parse(res.data));
      },
    });
  });
};
