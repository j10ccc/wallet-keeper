import useEnv from "@/hooks/useEnv";
import Taro from "@tarojs/taro";

const requestGlobalConfig = {
  url: useEnv().baseUrl,
  timeout: 5 * 1000
};

const request = <TData extends TaroGeneral.IAnyObject>(url: string, config: Omit<Taro.request.Option, "url">) => {
  return Taro.request<TData>({
    ...requestGlobalConfig,
    url: requestGlobalConfig.url + url,
    ...config
  });
};

export default request;
