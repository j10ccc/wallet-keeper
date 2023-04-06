import Nameplace from "@/components/Nameplace";
import PageView from "@/components/PageView";
import { ScrollView, View } from "@tarojs/components";
import AnalyseMonthCard from "./AnalyseMonthCard";
import AnalyseYearCard from "./AnalyseYearCard";

import styles from "./index.module.scss";

const AssetsPage = () => {
  return (
    <PageView isTabPage>
      <View className={styles.background} />
      <ScrollView enableFlex className={styles["scroll-view"]}>
        <Nameplace />
        <AnalyseYearCard />
        <AnalyseMonthCard />
      </ScrollView>
    </PageView>
  );
};

export default AssetsPage;
