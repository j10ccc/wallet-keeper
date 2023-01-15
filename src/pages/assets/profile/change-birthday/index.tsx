import useRequest from "@/hooks/useRequest";
import { ChangeBirthdayAPI } from "@/services/user/ChangeProfileAPI";
import { useUser } from "@/stores/useUser";
import { Picker } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useRef, useEffect } from "react";
import { AtListItem } from "taro-ui";

const ChangeBirthdayRow = () => {
  const {
    birthday: birthdayStore,
    setBirthday,
  } = useUser();

  const birthdayRef = useRef(birthdayStore as string);

  const { run, loading } = useRequest(ChangeBirthdayAPI, {
    manual: true,
    onSuccess: (res) => {
      if (res.data.code === 200) {
        setBirthday(birthdayRef.current);
      } else {
        Taro.showToast({ icon: "error", title: "修改失败" });
      }
    }
  });

  const changeBirthday = (value: string) => {
    birthdayRef.current = value;
    run({birthday: value});
  };

  useEffect(() => {
    if (loading === true) Taro.showLoading();
    else Taro.hideLoading();
  }, [loading]);

  return (
    <Picker
      value={birthdayStore as string}
      mode="date"
      onChange={(e) => changeBirthday(e.detail.value as string)}
    >
      <AtListItem
        title="生日"
        extraText={birthdayStore}
        arrow="right"
      />
    </Picker>
  );

};

export default ChangeBirthdayRow;
