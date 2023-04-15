import { useUser } from "@/stores/useUser";
import { useEffect, useState, memo } from "react";
import { ledgerTemplateList } from "@/constants/LedgerTemplateList";
import { AtIcon } from "taro-ui";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import styles from "./index.module.scss";

const LedgerCard = (props: {
  ledger: LedgerAPI.Ledger;
  selected?: boolean;
  onClick: (ledger: LedgerAPI.Ledger) => void;
}) => {
  const { ledger, selected } = props;

  const userStore = useUser();
  const [icon] = useState(() => {
    if (!ledger.template || ledger.template === "default") return null;
    else {
      return ledgerTemplateList.find(item =>
        item.name === ledger.template
      )!;
    }
  });

  const handleSelect = () => {
    props.onClick(ledger);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    Taro.navigateTo({
      url: `/pages/ledger-manager/update/index?id=${ledger.id}`,
    });
  };

  return (
    <View className={styles.card} onClick={handleSelect}>
      {selected && (
        <View className={styles.select}>
          <AtIcon prefixClass="icon" value="ok" size={20} />
        </View>
      )}
      { icon !== null
        && <View className={styles["template-icon"]}>
          <AtIcon prefixClass="icon"
            value={`ledger-${icon.icon}`}
            color={icon.color}
            size={48}
          />
        </View>
      }
      <Text className={styles.name}>{ledger.name}</Text>
      { ledger.isPublic
        && <View className={styles["share-tag"]}>共享</View>
      }
      { ledger.owner === userStore.username || ledger.id === 0
        && <View className={styles.more} onClick={handleEdit}>
          <AtIcon prefixClass="icon" value="more" />
        </View>
      }
    </View>
  );
};

type PropsType = {
  defaultSelectId?: number;
  onSelect: (ledger: LedgerAPI.Ledger ) => void;
  ledgers: LedgerAPI.Ledger[];
}

const LedgerSelector = (props: PropsType) => {
  const [ledgerID, setLedgerID] = useState(props.defaultSelectId);

  const handleSelect = (ledger: LedgerAPI.Ledger) => {
    props.onSelect(ledger);
  };

  useEffect(() => {
    setLedgerID(props.defaultSelectId);
  }, [props.defaultSelectId]);

  return (
    <View className={styles["ledgers-grid"]}>
      {props.ledgers.map((item) => (
        <LedgerCard
          ledger={item}
          key={item.id}
          selected={ledgerID === item.id}
          onClick={handleSelect}
        />
      ))}
    </View>
  );
};

export default memo(LedgerSelector);
