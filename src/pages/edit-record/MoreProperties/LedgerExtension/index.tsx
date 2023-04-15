import { useLedger } from "@/stores/useLedger";
import { Text, View } from "@tarojs/components";
import { useContext, useRef, useState } from "react";
import EditContext from "../../EditContext";
import styles from "./index.module.scss";
import { useQueryBills } from "@/stores/useQueryBills";
import LedgerPopup, { LedgerPopupRef } from "./LedgerPopup";
import LedgerUtils from "@/utils/LedgerUtils";

const LedgerExtension = () => {
  const ledgers = useLedger((store) => store.list);
  const selectedLedgerID = useQueryBills(store => store.ledgerID);
  const popupRef = useRef<LedgerPopupRef>(null);

  const { updateEffect, kindSelectorRef } = useContext(EditContext);

  const [selectedLedger, setSelectedLedger] = useState(
    ledgers.find((item) => item.id === selectedLedgerID)
  );

  const handleLedgerSelect = (ledger: LedgerAPI.Ledger) => {
    updateEffect({ ledgerID: ledger.id });
    setSelectedLedger(ledger);
    const template = LedgerUtils.getTemplate(ledger);
    kindSelectorRef?.current?.reset(template.expenseKinds, template.incomeKinds);
    popupRef.current?.setOpen(false);
  };

  return (
    <>
      <View className={styles.extension} onClick={() => popupRef.current?.setOpen(true) }>
        <Text className={styles.label}>{selectedLedger?.name || "未知账本"}</Text>
      </View>
      <LedgerPopup
        ref={popupRef}
        defaultSelectId={selectedLedger?.id}
        onSelect={handleLedgerSelect}
      />
    </>
  );
};

export default LedgerExtension;
