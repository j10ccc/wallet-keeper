import Button from "@/components/atoms/Button";
import FormPageHeader from "@/components/FormPageHeader";
import PageView from "@/components/PageView";
import useRequest from "@/hooks/useRequest";
import { ChangePasswordAPI } from "@/services/user/ChangeProfileAPI";
import { useUser } from "@/stores/useUser";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import { AtForm, AtInput } from "taro-ui";

const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeart] = useState("");

  const { clearUserInfo } = useUser();

  const { run, loading } = useRequest(ChangePasswordAPI, {
    manual: true,
    onSuccess: (res) => {
      if (res.data.code === 200) {
        clearUserInfo();
        Taro.switchTab({ url: "/pages/assets/index" });
      } else {
        Taro.showToast({ icon: "error", title: "修改失败"});
      }
    }
  });

  useEffect(() => {
    if (loading) Taro.showLoading();
    else Taro.hideLoading();
  }, [loading]);

  const onSubmit = () => {
    if (oldPassword === "" ||
      newPassword === "" ||
      newPasswordRepeat === ""
    ) {
      Taro.showToast({
        icon: "none",
        title: "请完成表单",
      });
    } else if (newPassword.length < 8) {
      Taro.showToast({
        icon: "none",
        title: "密码长度需要大于 8 位",
      });
    } else if (newPassword !== newPasswordRepeat ) {
      Taro.showToast({
        icon: "error",
        title: "两次密码不一致",
      });
    } else {
      run({
        old_password: oldPassword,
        new_password: newPassword
      });
      console.log("ok");
    }
  };

  const onReset = (e: any) => {
    console.log(e);
  };

  return <PageView>
    <FormPageHeader title="修改密码"/>
    <AtForm
      onSubmit={onSubmit}
      onReset={onReset}
    >
      <AtInput
        required
        name="old_password"
        title="旧密码"
        type="text"
        placeholder="输入旧密码"
        value={oldPassword}
        onChange={(value: string) => setOldPassword(value)}
      />
      <AtInput
        required
        name="new_password"
        title="新密码"
        type="password"
        placeholder="输入新密码"
        value={newPassword}
        onChange={(value: string) => setNewPassword(value)}
      />
      <AtInput
        required
        name="new_password_repeat"
        title="重复密码"
        type="password"
        placeholder="再次输入密码"
        value={newPasswordRepeat}
        onChange={(value: string) => setNewPasswordRepeart(value)}
      />
      <View style={{
        padding: "32rpx",
        display: "flex",
        flexDirection: "column",
        gap: "24rpx"
      }}>
        <Button block>提交</Button>
        <Button fill="outline" block>重置</Button>
      </View>
    </AtForm>
  </PageView>;
};

export default ChangePasswordPage;
