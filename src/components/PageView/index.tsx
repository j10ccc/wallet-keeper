import { View } from "@tarojs/components";
import classNames from "classnames";

import styles from "./index.module.scss";

type PropsType = {
  children?: React.ReactNode
  isTabPage?: boolean
}

const PageView = (props: PropsType) => {
  const { children, isTabPage } = props;
  return <View
    className={classNames([
      styles["page-view"],
      isTabPage ? styles["tab-page"]: undefined
    ])}
  >
    {children}
  </View>;
};

export default PageView;
