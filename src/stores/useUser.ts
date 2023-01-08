import create from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import storage from "./storage";

interface UserState {
  userInfo: PublicAPI.UserInfo & {
    isLogin: boolean,
  }
  setToken: (value: string) => void;
  setIsLogin: (value: boolean) => void;
  setUsername: (value: string) => void;
  setGender: (value: string) => void;
  setBirthday: (value: string) => void;
}

export const useUser = create<
  UserState,
  [["zustand/persist", UserState]]
>(
  persist(
    set => ({
      userInfo: {
        isLogin: false,
        username: undefined,
        token: undefined,
        gender: undefined,
        birthday: undefined
      },
      setToken: value => set(state => {
        state.userInfo.token = value;
        return state;
      }),
      setIsLogin: value => set(state => {
        state.userInfo.isLogin = value;
        return state;
      }),
      setUsername: value => set(state => {
        state.userInfo.username = value;
        return state;
      }),
      setGender: value => set(state => {
        state.userInfo.gender = value;
        return state;
      }),
      setBirthday: value => set(state => {
        state.userInfo.birthday = value;
        return state;
      })
    }),
    {
      name: "userInfo",
      storage: createJSONStorage(() => storage)
    }
  )
);
