import { request } from "../request";

export const RegisterAPI = (data: PublicAPI.RegisterAPI_Data) => {
  return request<PublicAPI.RegisterAPI_Result>("/api/user/register", {
    method: "POST",
    data
  });
};
