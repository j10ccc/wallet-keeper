import FormPageHeader from "@/components/FormPageHeader";
import PageView from "@/components/PageView";
import useRequest from "@/hooks/useRequest";
import { LoginAPI } from "@/services/public/LoginAPI";
import { useUser } from "@/stores/useUser";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import {
  AtButton,
  AtForm,
  AtInput,
} from "taro-ui";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setIsLogin, setUser } = useUser();

  const { run, loading } = useRequest(LoginAPI, {
    manual: true,
    onSuccess: (res) => {
      if (res.data.code === 200) {
        console.log(res.cookies);
        setIsLogin(true);
        setUser({
          ...res.data.data,
          token: (res.cookies || []).join("; ")
        });
        Taro.navigateBack();
      }
    }
  });

  useEffect(() => {
    if (loading) Taro.showLoading({title: "加载中"});
    else Taro.hideLoading();
  }, [loading]);

  const onSubmit = (e: any) => {
    const formData: { username: string, password: string }
      = e[0].detail.value;
    if (formData.username === "" || formData.password === "") {
      Taro.showToast({
        icon: "none",
        title: "请完成表单"
      });
    } else {
      run(formData);
    }
  };

  const onReset = (e: any) => {
    console.log(e);
  };

  return <PageView>
    <FormPageHeader title="登录账号"/>
    <AtForm
      onSubmit={onSubmit}
      onReset={onReset}
    >
      <AtInput
        required
        name="username"
        title="账号"
        type="text"
        placeholder="输入账号"
        value={username}
        onChange={(value: string) => setUsername(value)}
      />
      <AtInput
        required
        name="password"
        title="密码"
        type="password"
        placeholder="输入密码"
        value={password}
        onChange={(value: string) => setPassword(value)}
      />
      <View style={{
        padding: "0 32rpx"
      }}>
        <AtButton type="primary" formType="submit">提交</AtButton>
        <AtButton formType="reset">重置</AtButton>
      </View>
    </AtForm>
  </PageView>;
};

export default LoginPage;
