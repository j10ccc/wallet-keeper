import Button from "@/components/atoms/Button";
import FormPageHeader from "@/components/FormPageHeader";
import PageView from "@/components/PageView";
import { View, Text } from "@tarojs/components";
import { createContext, useContext, useRef, useState } from "react";
import { AtForm, AtIcon, AtInput, AtSwitch } from "taro-ui";
import styles from "./index.module.scss";
import { ledgerTemplateList } from "@/constants/LedgerTemplateList";
import classname from "classnames";
import LedgerService from "@/services/ledger";
import Taro from "@tarojs/taro";
import useRequest from "@/hooks/useRequest";
import { useLedger } from "@/stores/useLedger";

const TemplateSelectorContext = createContext<{
  templateName: string | undefined;
  setTemplateName: (value: string | undefined) => void;
    }>({
      templateName: "未知模版",
      setTemplateName: () => {
        // empty
      },
    });

const LedgerTemplateCard = (props: {
  name: string;
  color: string;
  icon: string;
}) => {
  const { templateName, setTemplateName } = useContext(TemplateSelectorContext);

  return (
    <View
      className={classname([
        styles.card,
        templateName === props.name ? styles.selected : undefined,
      ])}
      style={{ backgroundColor: props.color }}
      onClick={() => setTemplateName(props.name)}
    >
      <Text className={styles.name}>{props.name}</Text>
      <View className={styles.icon}>
        <AtIcon
          prefixClass="icon"
          value={`ledger-${props.icon}`}
          size={64}
          // color={props.color}
        />
      </View>
    </View>
  );
};

const CreateLedgerPage = () => {
  const formDataRef = useRef<Omit<LedgerAPI.Ledger, "id">>({
    name: "",
    isPublic: false,
  });
  const addLedgerInStore = useLedger((store) => store.create);

  const createLedger = useRequest(LedgerService.CreateItemAPI, {
    manual: true,
    onSuccess: (response, params) => {
      if (response.data.code === 200) {
        Taro.navigateBack();
        addLedgerInStore({
          id: response.data.data,
          name: params!.name,
          isPublic: params!.is_public,
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

  const [selectedTemplate, setSelectedTemplate] = useState<
    string | undefined
  >();

  const handleFinish = async () => {
    console.log(formDataRef);
    createLedger.run({
      name: formDataRef.current.name,
      is_public: formDataRef.current.isPublic,
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
      <TemplateSelectorContext.Provider
        value={{
          templateName: selectedTemplate,
          setTemplateName: setSelectedTemplate,
        }}
      >
        <Text className={styles.title}>推荐模板</Text>
        <View className={styles.templates}>
          {ledgerTemplateList.map((item) => (
            <LedgerTemplateCard
              key={item.icon}
              icon={item.icon}
              name={item.name}
              color={item.color}
            />
          ))}
        </View>
      </TemplateSelectorContext.Provider>
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
