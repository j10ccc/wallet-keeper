import LedgerSelector from "@/components/LedgerSelector";
import { useLedger } from "@/stores/useLedger";
import { View, Text, ScrollView } from "@tarojs/components";
import { forwardRef, useImperativeHandle, useState } from "react";
import styles from "./index.module.scss";

type PropsType = {
  defaultSelectId?: number;
  onSelect: (ledger: LedgerAPI.Ledger) => void;
}

export type LedgerPopupRef = {
  setOpen: (state: boolean) => void;
}

const LedgerPopup = forwardRef<LedgerPopupRef, PropsType>((props, ref) => {
  const ledgers = useLedger(store => store.list);
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      setOpen: (state) => setIsOpen(state)
    };
  }, []);

  const handleSelect = (ledger: LedgerAPI.Ledger) => {
    props.onSelect(ledger);
  };

  if (!isOpen) return null;
  else
    return <View className={styles.container}>
      <View className={styles.shadow} onClick={() => setIsOpen(false)} />
      <View className={styles.popup}>
        <View className={styles.header}>
          <View className={styles.action}>
            <Text> 取消 </Text>
          </View>
          <View className={styles.title}>
            <Text> 选择一个账本 </Text>
          </View>
          <View className={styles.action}>
            <Text> 管理 </Text>
          </View>
        </View>
        <View className={styles.body}>
          <ScrollView scrollY className={styles.scroll}>
            <LedgerSelector
              ledgers={ledgers}
              onSelect={handleSelect}
              defaultSelectId={props.defaultSelectId}
            />
          </ScrollView>
        </View>
      </View>
    </View>;
});

LedgerPopup.displayName = "LedgerPopup";

export default LedgerPopup;
