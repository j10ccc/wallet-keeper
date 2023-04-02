import request from "../request";

/**
 * @Deprecated
 */
export const LoginAPI = (data: PublicAPI.LoginAPI_Data) => {
  return request<PublicAPI.LoginAPI_Result>("/api/user/login", {
    method: "POST",
    data,
  });
};

export const LoginByWXAPI = (data: PublicAPI.LoginByWXAPI_Data) => {
  return request<PublicAPI.LoginAPI_Result>(`/api/user/login/${data.code}`, {
    method: "GET",
  });
};
