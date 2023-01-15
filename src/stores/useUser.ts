import create from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import storage from "./storage";

interface UserState extends Partial<PublicAPI.UserInfo> {
  isLogin: boolean,
  setToken: (value: string) => void;
  setIsLogin: (value: boolean) => void;
  setUsername: (value: string) => void;
  setGender: (value: string) => void;
  setBirthday: (value: string) => void;
  setUser: (value: PublicAPI.UserInfo) => void;
  clearUserInfo: () => void;
}

export const useUser = create<
  UserState,
  [["zustand/persist", UserState]]
>(
  persist(
    set => ({
      isLogin: false,
      username: undefined,
      token: undefined,
      gender: undefined,
      birthday: undefined,
      setToken: value => set(() => ({
        token: value
      })),
      setIsLogin: value => set(() => ({
        isLogin: value
      })),
      setUsername: value => set(() => ({
        username: value
      })),
      setGender: value => set(() => ({
        gender: value
      })),
      setBirthday: value => set(() => ({
        birthday: value
      })),
      setUser: value => set(() => ({
        ...value
      })),
      clearUserInfo: () => set(() => ({
        isLogin: false,
        username: undefined,
        token: undefined,
        gender: undefined,
        birthday: undefined
      }))
    }),
    {
      name: "userInfo",
      storage: createJSONStorage(() => storage)
    }
  )
);
