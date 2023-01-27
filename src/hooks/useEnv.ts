const useEnv = () => {
  let baseUrl = "";

  if (process.env.NODE_ENV === "development") {
    baseUrl = "https://api.patrickstar.net.cn";
  }
  else {
    baseUrl = "https://api.patrickstar.net.cn";
  }

  return {
    baseUrl
  };
};

export default useEnv;
