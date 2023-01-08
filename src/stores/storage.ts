import Taro from "@tarojs/taro";
import { StateStorage } from "zustand/middleware";

const storage: StateStorage = {
  getItem: (key: string) => {
    console.log(key);
    return Taro.getStorageSync(key) || null;
  },
  setItem: (key: string, data: string) => {
    console.log(key);
    return Taro.setStorageSync(key, data);
  },
  removeItem: (key: string) => {
    return Taro.removeStorageSync(key);
  }
};

export default storage;
