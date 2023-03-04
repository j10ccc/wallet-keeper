import Nameplace from "@/components/Nameplace";
import PageView from "@/components/PageView";
import { View } from "@tarojs/components";

import styles from "./index.module.scss";

const AssetsPage = () => {
  return (
    <PageView>
      <View className={styles.background} />
      <Nameplace />
    </PageView>
  );
};

export default AssetsPage;
