import { View } from "@tarojs/components";

import styles from "./index.module.scss";

type PropsType = {
  children?: React.ReactNode
}

const PageView = (props: PropsType) => {
  const { children } = props;
  return <View
    className={styles["page-view"]}
  >
    {children}
  </View>;
};

export default PageView;
