import FormPageHeader from "@/components/FormPageHeader";
import PageView from "@/components/PageView";
import { useLedger } from "@/stores/useLedger";
import { Text, View } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { AtInput, AtList, AtListItem, AtSwitch } from "taro-ui";
import { useEffect, useRef, useState } from "react";
import { CellLabel } from "@/components/atoms";
import LedgerService from "@/services/ledger";
import styles from "./index.module.scss";

const UpdateLedgerPage = () => {
  const { router } = getCurrentInstance();
  const {
    list: ledgers,
    update: updateLedger,
    delete: deleteLedger,
  } = useLedger();

  const formDataRef = useRef<LedgerAPI.Ledger>({
    id: -1,
    name: "",
    isPublic: false,
    template: "default",
    owner: "未知用户"
  });
  const [initialFormData, setInitialFormData] = useState<LedgerAPI.Ledger>(
    formDataRef.current
  );

  useEffect(() => {
    const targetId = parseInt(router?.params.id || "-1") || null;
    const ledger = ledgers.find((item) => item.id === targetId);

    if (!ledger) {
      Taro.showModal({
        title: "错误",
        content: "未知账本ID, 请刷新账本信息!",
        success: () => {
          Taro.navigateBack();
        },
        fail: () => {
          Taro.navigateBack();
        },
      });
    } else {
      setInitialFormData(ledger);
      formDataRef.current = ledger;
    }
  }, []);

  const handleInvite = async () => {
    try {
      const res = await LedgerService.FetchShareCodeAPI({
        ledger_id: initialFormData.id,
      });
      if (res.data.code === 200) {
        Taro.showModal({
          title: "邀请",
          content: `该账本分享码为\r\n${res.data.data}`,
          confirmText: "复制",
          cancelText: "我知道了",
          success: (modelRes) => {
            if (modelRes.confirm) {
              Taro.setClipboardData({
                data: res.data.data,
              });
            }
          },
        });
      } else {
        throw new Error(res.data.msg);
      }
    } catch (e) {
      Taro.showToast({
        icon: "none",
        title: e.message || "未知错误",
      });
    }
  };

  const handleUpdatePublic = async (state: boolean) => {
    formDataRef.current.isPublic = state;
    try {
      const res = await LedgerService.UpdateItemAPI({
        ...formDataRef.current,
        id: formDataRef.current.id,
        name: formDataRef.current.name,
        is_public: formDataRef.current.isPublic,
      });
      if (res.data.code === 200) {
        Taro.showToast({
          icon: "none",
          title: `已设置为${state ? "可见" : "不可见"}`,
        });
        setInitialFormData(formDataRef.current);
        updateLedger(formDataRef.current);
      } else {
        throw new Error(res.data.msg);
      }
    } catch (e) {
      console.log(e);
      setInitialFormData({
        ...formDataRef.current,
        isPublic: !formDataRef.current,
      });
      Taro.showToast({
        icon: "none",
        title: e.message || "未知错误",
      });
    }
  };

  const handleUpdateName = async () => {
    try {
      const res = await LedgerService.UpdateItemAPI({
        id: formDataRef.current.id,
        name: formDataRef.current.name,
        is_public: formDataRef.current.isPublic,
      });
      if (res.data.code == 200) {
        Taro.showToast({
          icon: "none",
          title: "成功设置账本名称",
        });
        setInitialFormData(formDataRef.current);
        updateLedger(formDataRef.current);
      } else {
        throw new Error(res.data.msg);
      }
    } catch (e) {
      Taro.showToast({
        icon: "none",
        title: e.message || "未知错误",
      });
    }
  };

  const handleDeleteLedger = () => {
    Taro.showModal({
      title: "确认删除账本",
      content: "删除账本后，账本中的消费记录会丢失",
      success: async (res) => {
        if (!res.confirm) return;
        try {
          const res = await LedgerService.DeleteItemAPI({
            id: initialFormData.id,
          });
          if (res.data.code === 200) {
            deleteLedger(initialFormData.id);
            Taro.navigateBack();
          } else {
            throw new Error(res.data.msg);
          }
        } catch (e) {
          Taro.showToast({
            icon: "error",
            title: "删除失败",
          });
          console.log(e);
        }
      },
    });
  };

  return (
    <PageView>
      <FormPageHeader title="编辑账本" />
      <View className={styles.options}>
        <CellLabel title="设置" />
        <AtList>
          <AtInput
            required
            name="name"
            type="text"
            title="账本名称"
            value={initialFormData.name}
            onChange={(value: string) => (formDataRef.current.name = value)}
          >
            <View className={styles.confirm}>
              <Text onClick={handleUpdateName}>确认</Text>
            </View>
          </AtInput>
          <AtListItem title="账本统计" arrow="right" />
        </AtList>
        <CellLabel title="选项" />
        <AtList>
          <AtListItem title="删除消费记录" arrow="right" disabled />
          <AtListItem
            title="删除账本"
            arrow="right"
            onClick={handleDeleteLedger}
          />
        </AtList>
        <CellLabel title="共享成员" />
        <AtList>
          <AtSwitch
            title="与他人共享"
            checked={initialFormData.isPublic}
            onChange={(state) => handleUpdatePublic(state)}
          />
          <AtListItem
            title="邀请新成员"
            hasBorder={false}
            arrow="right"
            onClick={handleInvite}
            disabled={!initialFormData.isPublic}
          />
        </AtList>
      </View>
    </PageView>
  );
};

export default UpdateLedgerPage;
