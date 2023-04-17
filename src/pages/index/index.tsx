import IndexHeader from "./IndexHeader";
import { useEffect, useRef, useState } from "react";
import PageView from "@/components/PageView";
import { useQueryBills } from "@/stores/useQueryBills";
import { useBillRecords } from "@/stores/useBillRecords";
import TodayBill from "@/components/TodayBill";
import { ScrollView } from "@tarojs/components";
import CreateRecordBubble from "./CreateRecordBubble";
import WeeklyStatisticCard from "@/components/WeeklyStatisticCard";
import styles from "./index.module.scss";
import UserUtils from "@/utils/UserUtils";
import { useUser } from "@/stores/useUser";
import { ledgerTemplateList } from "@/constants/LedgerTemplateList";
import { useLedger } from "@/stores/useLedger";
import LedgerUtils from "@/utils/LedgerUtils";
import RecordUtils from "@/utils/RecordUtils";
import dayjs from "dayjs";

type ValidMapType = {
  // key: date string
  [key: string]: BillAPI.BillRecord[];
};

const IndexPage = () => {
  const ledgers = useLedger(store => store.list);
  const { date, type, ledgerID = ledgers[0]?.id || 0, setLedgerID } = useQueryBills();
  const { list: originList } = useBillRecords();
  const [validMap, setValidMap] = useState<ValidMapType>({});
  const { isLogin, setToken } = useUser();
  const [isRefreshRiggered, setIsRefreshRiggered] = useState(false);
  const recordStore = useBillRecords();
  const userStore = useUser();

  // refs
  const currentLedger = useRef(LedgerUtils.getLedger(ledgerID, ledgers));
  const currentTemplate = useRef(LedgerUtils.getTemplate(currentLedger.current));
  const kindLabelMap = useRef(LedgerUtils.getTemplateKindLabelMap(
    currentTemplate.current || ledgerTemplateList[0])
  );

  useEffect(() => {
    if (isLogin) {
      UserUtils.refreshUserToken().then(res => {
        setToken(res);
      });
    }
  }, []);

  const filterList = () => {
    setValidMap((state) => {
      // TODO: expand more filter deps
      const tmp = originList
        .filter((item) => ledgerID !== undefined && item.ledgerID === ledgerID)
        .filter((item) => item.date.startsWith(`${date.year}-${date.month}-`));

      state = {};
      tmp.forEach((item) => {
        if (state[item.date] === undefined) state[item.date] = [];
        state[item.date].push(item);
      });
      return state;
    });
  };

  useEffect(() => {
    filterList();
  }, [date, originList, ledgerID]);

  useEffect(() => {
    /* change kindLabelMap */
    currentLedger.current = LedgerUtils.getLedger(ledgerID, ledgers);
    currentTemplate.current = LedgerUtils.getTemplate(currentLedger.current);
    kindLabelMap.current = LedgerUtils.getTemplateKindLabelMap(currentTemplate.current);
  }, [ledgerID]);

  const handlePull = async () => {
    setIsRefreshRiggered(true);
    if (userStore.isLogin) {
      const res = await RecordUtils.getMergeData(
        dayjs(`${date.year}-${date.month}`).format("YYYY-MM"),
        "month",
        ledgerID || 0,
        recordStore.indexList,
        recordStore.list
      );
      res.forEach(item => recordStore.addItem(item));
    }

    setIsRefreshRiggered(false);
  };

  return (
    <PageView isTabPage>
      <IndexHeader />
      <ScrollView
        className={styles["scroll-view"]}
        scrollY
        refresherEnabled={true}
        refresherBackground="#f0f0f0"
        refresherThreshold={1000}
        refresherTriggered={isRefreshRiggered}
        onRefresherRefresh={handlePull}
      >
        <WeeklyStatisticCard />
        {Object.keys(validMap).map((item) => (
          <TodayBill
            key={item}
            date={item}
            list={validMap[item]}
            type={type}
            kindLabelMap={kindLabelMap.current}
          />
        ))}
      </ScrollView>
      <CreateRecordBubble />
    </PageView>
  );
};

export default IndexPage;
