import Button from "@/components/atoms/Button";
import FormPageHeader from "@/components/FormPageHeader";
import PageView from "@/components/PageView";
import { useUser } from "@/stores/useUser";
import { View } from "@tarojs/components";
import { AtList, AtListItem } from "taro-ui";
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
    <View className={styles.footer}>
      <Button
        fill="outline"
        onClick={handleLogout}
        color="danger"
        block
      >
      退出登陆
      </Button>
    </View>

  </PageView>;
};

export default ProfilePage;
