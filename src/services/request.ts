import useEnv from "@/hooks/useEnv";
import Taro from "@tarojs/taro";

interface IInterceptor<S> {
  request: ((options: Taro.request.Option) =>
    Taro.request.Option | boolean) | null;
  response: ((res: TaroGeneral.CallbackResult ) => S | boolean) | null;
}

class Http<S> {
  public baseUrl: string;
  public config: Taro.request.Option;
  public interceptor: IInterceptor<S>;

  constructor() {
    this.config = {
      url: "",
    };
    this.interceptor = {
      request: null,
      response: null
    };
  }

  public create(globalConfig: Omit<Taro.request.Option, "url">, baseUrl: string) {
    this.config = { ...globalConfig, url: "" };
    this.baseUrl = baseUrl;
  }

  public request<T>(options: Taro.request.Option) {
    if (this.interceptor.request) {
      const reqInterceptor = this.interceptor.request(options);
      if (reqInterceptor === false) {
        return new Promise<T>(() => {});
      }
      this.config = options;
    }

    return new Promise<T>(( resolve, reject ) => {
      options.url = `${this.baseUrl}${options.url}`;
      options.complete = (response) => {
        if (this.interceptor.response) {
          const resInterceptor = this.interceptor.response(response);
          if (resInterceptor !== false) resolve(resInterceptor as T);
          else {
            reject(response);
          }
        } else {
          resolve(response as T);
        }
      };
      Taro.request<T>(options);
    });
  }
}

const requestConfig = {
  timeout: 5 * 1000
};

const http = new Http();
// global request config
http.create(requestConfig, useEnv().baseUrl);

http.interceptor.request = (option) => {
  if (option.header === undefined) option.header = {};
  // const { token } = useUser();
  // console.log("request", token);

  const token = Taro.getStorageSync("auth_token");
  if (token) option.header["Cookie"] = token;
  return option;
};

http.interceptor.response = (response: any) => {
  if (response.statusCode === 200) {
    const { code, msg } = response.data;
    if (code === 200) {
      if (response.cookies.length !== 0) {
        Taro.setStorageSync("auth_token", JSON.stringify(response.cookies));
      }
      return response.data;
    }
    else {
      Taro.showToast({ title: msg || "网络错误1", icon: "error" });
    }
  } else {
    Taro.showToast({ title: "网络错误0", icon: "error" });
  }
};

export const request = <T>(url: string, config: Omit<Taro.request.Option, "url">) => {
  return http.request<T>({url, ...config});
};
