declare namespace User {

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
