import Button from "@/components/atoms/Button";
import FormPageHeader from "@/components/FormPageHeader";
import PageView from "@/components/PageView";
import { View, Text } from "@tarojs/components";
import { useCallback, useRef, useState } from "react";
import { AtForm, AtIcon, AtInput, AtSwitch } from "taro-ui";
import styles from "./index.module.scss";
import { ledgerTemplateList } from "@/constants/LedgerTemplateList";
import classname from "classnames";
import LedgerService from "@/services/ledger";
import Taro from "@tarojs/taro";
import useRequest from "@/hooks/useRequest";
import { useLedger } from "@/stores/useLedger";
import { useUser } from "@/stores/useUser";

const TemplateGrid = (props: {
  onSelect: (templateName: string) => void;
}) => {
  const [templateName, setTemplateName] = useState<string>("default");

  const handleTemplateClick = (name: string) => {
    setTemplateName(name);
    props.onSelect(name);
  };

  return (
    <View className={styles.templates}>
      {ledgerTemplateList.map((item) => (
        <View
          key={item.name}
          className={classname([
            styles.card,
            templateName === item.name ? styles.selected : undefined,
          ])}
          style={{ backgroundColor: item.color }}
          onClick={() => handleTemplateClick(item.name)}
        >
          <Text className={styles.name}>{item.name}</Text>
          <View className={styles.icon}>
            <AtIcon
              prefixClass="icon"
              value={`ledger-${item.icon}`}
              size={64}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

interface IFormData extends Omit<LedgerAPI.Ledger, "id" | "owner">{}

const CreateLedgerPage = () => {
  const formDataRef = useRef<IFormData>({
    name: "",
    isPublic: false,
    template: "default"
  });
  const addLedgerInStore = useLedger((store) => store.create);
  const userName = useUser(store => store.username);

  const createLedger = useRequest(LedgerService.CreateItemAPI, {
    manual: true,
    onSuccess: (response, params) => {
      if (response.data.code === 200) {
        Taro.navigateBack();
        addLedgerInStore({
          id: response.data.data,
          name: params!.name,
          isPublic: params!.is_public,
          owner: userName!,
          template: params!.template
        });
      } else {
        throw new Error(response.data.msg);
      }
    },
    onError: (e) => {
      Taro.showToast({
        title: JSON.stringify(e),
        icon: "none",
      });
    },
  });

  const handleTemplateSelect = useCallback((name: string) => {
    formDataRef.current.template = name;
  }, []);

  const handleFinish = async () => {
    createLedger.run({
      name: formDataRef.current.name,
      is_public: formDataRef.current.isPublic,
      template: formDataRef.current.template
    });
  };

  return (
    <PageView>
      <FormPageHeader title="创建账本" />
      <AtForm>
        <AtInput
          required
          name="name"
          title="账本名称"
          placeholder="起一个合适的名字吧"
          onChange={(value: string) => {
            formDataRef.current.name = value;
          }}
        />
        <AtSwitch
          title="与他人共享"
          onChange={(value: boolean) => {
            formDataRef.current.isPublic = value;
          }}
        />
      </AtForm>
      <View>
        <Text className={styles.title}>记账场景</Text>
        <TemplateGrid onSelect={handleTemplateSelect}/>
      </View>
      <View className={styles.actions}>
        <Button
          loading={createLedger.loading}
          onClick={handleFinish}
          block
        >
          创建
        </Button>
      </View>
    </PageView>
  );
};

export default CreateLedgerPage;
