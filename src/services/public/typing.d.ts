interface BaseResult {
  code: number;
  msg: string;
}

declare namespace PublicAPI {
  interface UserInfo {
    username?: string;
    gender?: string;
    birthday?: string;
    token?: string;
  }

  interface RegisterAPI_Data {
    username: string;
    password: string;
    birthday: string;
    gender: string;
  }

  interface RegisterAPI_Result extends BaseResult {
    data: null;
  }

  interface LoginAPI_Data {
    username: string;
    password: string;
  }

  interface LoginAPI_Result extends BaseResult {
    data: null;
  }

  interface ChangeGender_Data {
    gender: string;
  }

  interface ChangeGender_Result extends BaseResult {
    data: null;
  }

  interface ChangeBirthday_Data {
    birthday: string;
  }

  interface ChangeBirthday_Result extends BaseResult {
    data: null;
  }

  interface ChangePassword_Data {
    old_password: string;
    new_password: string;
  }

  interface ChangePassword_Result extends BaseResult {
    data: null;
  }

}
