import useRequest from "@/hooks/useRequest";
import { ChangeGenderAPI } from "@/services/user/ChangeProfileAPI";
import { useUser } from "@/stores/useUser";
import { Picker } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useState, useRef, useEffect } from "react";
import { AtListItem } from "taro-ui";

const ChangeGenderRow = () => {
  const {
    gender: genderStore,
    setGender
  } = useUser();

  const genderList = ["男", "女"];
  const [genderIndex, setGenderIndex] =
    useState(genderList.indexOf(genderStore || "男"));
  const genderIndexRef = useRef(genderIndex);

  const { run, loading } = useRequest(ChangeGenderAPI, {
    manual: true,
    onSuccess: res => {
      if (res.data.code === 200) {
        setGender(genderList[genderIndexRef.current]);
        setGenderIndex(genderIndexRef.current);
      } else {
        Taro.showToast({ icon: "error", title: "修改失败" });
      }
    }
  });

  const handleChangeGender = (index: number) => {
    genderIndexRef.current = index;
    run({ gender: genderList[index] });
  };

  useEffect(() => {
    if (loading) Taro.showLoading();
    else Taro.hideLoading();
  }, [loading]);

  return (
    <Picker
      value={genderIndex}
      range={genderList}
      mode="selector"
      onChange={(e) =>
        handleChangeGender(parseInt(e.detail.value as string))
      }
    >
      <AtListItem
        title="性别"
        extraText={genderStore}
        arrow="right"
      />
    </Picker>
  );
};

export default ChangeGenderRow;
