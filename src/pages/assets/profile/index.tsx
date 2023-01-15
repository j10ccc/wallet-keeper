import FormPageHeader from "@/components/FormPageHeader";
import PageView from "@/components/PageView";
import { useUser } from "@/stores/useUser";
import { View } from "@tarojs/components";
import { AtButton, AtList, AtListItem } from "taro-ui";
import Taro from "@tarojs/taro";
import ChangeBirthdayRow from "./change-birthday";
import ChangeGenderRow from "./change-gender";

import styles from "./index.module.scss";

const ProfilePage = () => {
  const {
    username: usernameStore,
    clearUserInfo
  } = useUser();

  const handleChangePassword = () => {
    Taro.navigateTo({
      url: "change-password/index"
    });
  };

  const handleLogout = () => {
    clearUserInfo();
    Taro.navigateBack();
  };

  return <PageView>
    <FormPageHeader title="我的资料" />
    <View className={styles["form-container"]}>
      <AtList>
        <AtListItem
          title="用户名"
          extraText={usernameStore}
        ></AtListItem>
        <ChangeBirthdayRow />
        <ChangeGenderRow />
        <AtListItem
          title="修改密码"
          arrow="right"
          onClick={handleChangePassword}
        />
      </AtList>
    </View>
    <AtButton
      full
      type="secondary"
      customStyle={{
        border: "2rpx solid red",
        color: "red"
      }}
      onClick={handleLogout}
    >退出登录
    </AtButton>
  </PageView>;
};

export default ProfilePage;
