import create from "zustand";

interface UserState extends PublicAPI.UserInfo {
  isLogin: boolean;
  setToken: (value: string) => void;
  setIsLogin: (value: boolean) => void;
}

export const useUser = create<UserState>(set => ({
  isLogin: false,
  username: undefined,
  token: undefined,
  gender: undefined,
  birthday: undefined,
  setToken: (value) => set(() => ({token: value})),
  setIsLogin: (value) => set(() => ({isLogin: value}))

}));
