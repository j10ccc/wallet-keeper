import { useLedger } from "@/stores/useLedger";
import { Text, View } from "@tarojs/components";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";

type PropsType = {
  originValue: React.RefObject<BillAPI.DraftType>;
};

const LedgerExtension = (props: PropsType) => {
  const ledgers = useLedger((store) => store.list);
  const defaultLedgerID = props.originValue.current?.ledgerID;

  const [ledgerName, setLedgerName] = useState(
    ledgers.find((item) => item.id === defaultLedgerID)?.name
  );

  return (
    <View className={styles.extension}>
      <Text className={styles.label}>{ledgerName || "未知账本"}</Text>
    </View>
  );
};

export default LedgerExtension;
