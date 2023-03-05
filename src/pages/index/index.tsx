import IndexHeader from "./IndexHeader";
import { useEffect, useState } from "react";
import PageView from "@/components/PageView";
import { useQueryBills } from "@/stores/useQueryBills";
import { useBillRecords } from "@/stores/useBillRecords";
import TodayBill from "@/components/TodayBill";

import styles from "./index.module.scss";
import { ScrollView } from "@tarojs/components";
import CreateRecordBubble from "./CreateRecordBubble";

type ValidMapType = {
  // key: date string
  [key: string]: BillAPI.BillRecord[]
}

const IndexPage = () => {
  const { date, type } = useQueryBills();
  const { list: originList } = useBillRecords();
  const [validMap, setValidMap] = useState<ValidMapType>({});

  const filterList = () => {
    setValidMap((state) => {
      // TODO: expand more filter deps
      const tmp = originList
        .filter(item => item.date.startsWith(`${date.year}-${date.month}-`));

      state = {};
      tmp.forEach(item => {
        if (state[item.date] === undefined)
          state[item.date] = [];
        state[item.date].push(item);
      });
      return state;
    });
  };

  useEffect(() => {
    filterList();
  }, [date, originList]);

  return (
    <PageView>
      <IndexHeader />
      <ScrollView
        className={styles["scroll-view"]}
        scrollY
      >
        {Object.keys(validMap).map(item =>
          <TodayBill
            key={item}
            date={item}
            list={validMap[item]}
            type={type}
          />
        )}
      </ScrollView>
      <CreateRecordBubble />
    </PageView>
  );
};

export default IndexPage;
