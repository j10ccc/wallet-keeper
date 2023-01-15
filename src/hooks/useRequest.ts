// 全局配置
// 拦截器

import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";

interface RequestConfigType<TData extends TaroGeneral.IAnyObject, TParams> {
  manual?: boolean;
  defaultParams?: TParams;
  onBefore?: (config: Taro.request.Option) => void;
  onSuccess?: (response: Taro.request.SuccessCallbackResult<TData>) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
}

/**
 * @template T 返回的 data 类型
 * @param url 请求地址
 * @param config 在 Taro.request.Option 基础上增加了生命周期的配置
 */
const useRequest = <TData extends TaroGeneral.IAnyObject, TParams>(
  service: (params?: TParams) => Promise<Taro.request.SuccessCallbackResult<TData>>,
  config?: RequestConfigType<TData, TParams>
) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TData>();
  const [error, setError] = useState<Error>();

  const fetch = (params?: TParams) => {
    setLoading(true);
    service(params || config?.defaultParams).then((response) => {
      // FIXME: Taro 请求错误也会进入
      if (config?.onSuccess) {
        config.onSuccess(response);
      }
      setData(response.data);
      setLoading(false);
    }).catch((error) => {
      if (config?.onError) config.onError(error);
      setError(error);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (!config?.manual) {
      fetch();
    }
  }, []);

  return {
    loading,
    data,
    error,
    run: fetch,
    runAsync: service
  };
};

export default useRequest;
