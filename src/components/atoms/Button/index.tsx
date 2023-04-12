import { View, Text } from "@tarojs/components";
import classNames from "classnames";
import { CSSProperties, ReactNode } from "react";
import styles from "./index.module.scss";

type PropsType = {
  children: ReactNode;
  loading?: boolean;
  loadingText?: string;
  color?: "primary" | "danger";
  fill?: "solid" | "outline";
  style?: CSSProperties;
  block?: boolean,
  disabled?: boolean,
  onClick?: () => void,
  shape?: "rounded" | "default"
}

const Button = (props: PropsType) => {
  const {
    children,
    loading = false,
    loadingText = "正在加载",
    color = "primary",
    fill = "solid",
    block = false,
    disabled = false,
    onClick,
    shape = "default",
    style
  } = props;

  return (
    <View
      className={
        classNames([
          styles.button,
          loading && styles.loading,
          styles[fill],
          styles[color],
          block && styles.block,
          disabled && styles.disabled,
          styles[shape]
        ])
      }
      onClick={onClick}
      style={style}
    >
      { !loading
        ? <Text> { children } </Text>
        : <Text> { loadingText } </Text>
      }
    </View>
  );
};

export default Button;
