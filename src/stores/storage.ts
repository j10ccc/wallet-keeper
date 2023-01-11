import Taro from "@tarojs/taro";
import { StateStorage } from "zustand/middleware";

const storage: StateStorage = {
  getItem: (key: string) => {
    return Taro.getStorageSync(key) || null;
  },
  setItem: (key: string, data: string) => {
    return Taro.setStorageSync(key, data);
  },
  removeItem: (key: string) => {
    return Taro.removeStorageSync(key);
  }
};

export default storage;
