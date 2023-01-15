interface BaseResult {
  code: number;
  msg: string;
}

declare namespace PublicAPI {
  interface UserInfo {
    username: string;
    gender: string;
    birthday: string;
    token: string;
  }

  interface RegisterAPI_Data extends Omit<UserInfo, "token"> {
    password: string;
  }

  interface RegisterAPI_Result extends BaseResult {
    data: null
  }

  interface LoginAPI_Data {
    username: string;
    password: string;
  }

  interface LoginAPI_Result extends BaseResult {
    data: {
      username: string;
      gender: string;
      birthday: string;
    };
  }

}
