import { request } from "../request";

export const LoginAPI = (data: PublicAPI.LoginAPI_Data) => {
  return request<PublicAPI.LoginAPI_Result>("/api/user/login", {
    method: "POST",
    data
  });
};
