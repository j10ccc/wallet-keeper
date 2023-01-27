// 全局配置
// 拦截器

import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";

interface RequestConfigType<TData extends TaroGeneral.IAnyObject, TParams> {
  manual?: boolean;
  defaultParams?: TParams;
  onBefore?: () => void;
  onSuccess?: (response: Taro.request.SuccessCallbackResult<TData>) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
}

const useRequest = <TData extends TaroGeneral.IAnyObject, TParams>(
  service: (params?: TParams) => Promise<Taro.request.SuccessCallbackResult<TData>>,
  config?: RequestConfigType<TData, TParams>
) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TData>();
  const [error, setError] = useState<Error>();

  const fetch = (params?: TParams) => {
    config?.onBefore?.();
    setLoading(true);
    service(params || config?.defaultParams).then((response) => {
      config?.onSuccess?.(response);
      setData(response.data);
      setLoading(false);
    }).catch((error) => {
      config?.onError?.(error);
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
