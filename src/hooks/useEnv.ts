const useEnv = () => {
  let baseUrl = "";

  if (process.env.NODE_ENV === "development") {
    baseUrl =  "http://127.0.0.1:4523/m1/2050675-0-default";
  }
  else {
    baseUrl =  "http://127.0.0.1:4523/m1/2050675-0-default";
  }

  return {
    baseUrl
  };
};

export default useEnv;
