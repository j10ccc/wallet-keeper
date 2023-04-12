import Button from "@/components/atoms/Button";
import FormPageHeader from "@/components/FormPageHeader";
import PageView from "@/components/PageView";
import useRequest from "@/hooks/useRequest";
import { RegisterAPI } from "@/services/public/RegisterAPI";
import { useUser } from "@/stores/useUser";
import { Picker, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import {
  AtForm,
  AtInput,
  AtList,
  AtListItem,
} from "taro-ui";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [birthday, setBirthday] = useState("2022-01-01");
  const [genderIndex, setGenderIndex] = useState(0);

  const { setUser, setIsLogin } = useUser();

  const genderList = ["男" , "女"];

  const { run, loading } = useRequest(RegisterAPI, {
    manual: true,
    onSuccess: (res) => {
      if (res.data.code === 200) {
        setUser({
          username,
          birthday,
          gender: genderList[genderIndex],
          token: (res.cookies || []).join("; ")
        });
        setIsLogin(true);
        Taro.navigateBack();
      }
    }
  });

  useEffect(() => {
    if (loading) {
      Taro.showLoading({title: "加载中"});
    } else {
      Taro.hideLoading();
    }
  }, [loading]);

  const onSubmit = async (e: any) => {
    const formData = {
      username,
      birthday,
      gender: genderList[genderIndex]
    };
    if (formData.username === "" ||
        formData.birthday === "" ||
        formData.gender === ""
    ) {
      Taro.showToast({
        icon: "none",
        title: "请完成表单"
      });
    } else {
      const { code } = await Taro.login();
      run({
        ...formData,
        code
      });
    }

  };

  const onReset = (e: any) => {
    console.log(e);
  };

  return <PageView>
    <FormPageHeader title="注册账号"/>
    <AtForm
      onSubmit={onSubmit}
      onReset={onReset}
    >
      <AtInput
        required
        name="username"
        title="用户名"
        type="text"
        placeholder="输入用户名"
        value={username}
        onChange={(value: string) => setUsername(value)}
      />
      <Picker value={birthday} mode="date" onChange={(e) => setBirthday(e.detail.value)}>
        <AtList>
          <AtListItem title="生日" extraText={birthday} />
        </AtList>
      </Picker>
      <Picker
        value={genderIndex}
        mode="selector"
        onChange={(e) => setGenderIndex(e.detail.value as number)}
        range={["男", "女"]}
      >
        <AtList>
          <AtListItem title="性别" extraText={genderList[genderIndex]} />
        </AtList>
      </Picker>
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

export default RegisterPage;
