import IndexHeader from "./IndexHeader";
import { useEffect, useState } from "react";
import PageView from "@/components/PageView";
import { useQueryBills } from "@/stores/useQueryBills";
import { useBillRecords } from "@/stores/useBillRecords";
import TodayBill from "@/components/TodayBill";
import shallow from "zustand/shallow";

import styles from "./index.module.scss";
import { ScrollView } from "@tarojs/components";

type ValidMapType = {
  // key: date string
  [key: string]: Bill.BillRecord[]
}

const IndexPage = () => {
  const { date, type } = useQueryBills();
  const dataSet = useBillRecords(
    state => state.dataSet,
    shallow
  );
  const [validMap, setValidMap] = useState<ValidMapType>({});

  const filterList = () => {
    setValidMap((state) => {
      // TODO: expand more filter deps
      const tmp = dataSet[date.year.toString()][date.month.toString()];

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
  }, [date, dataSet]);

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
    </PageView>
  );
};

export default IndexPage;
