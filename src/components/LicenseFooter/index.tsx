import { ProdName } from "@/constants/Things";
import { View, Text } from "@tarojs/components";
import styles from "./index.module.scss";

const LicenseFooter = () => {
  return (
    <View className={styles.container}>
      <Text>用户协议</Text>
      <Text> · </Text>
      <Text>法律声明</Text>
      <Text> ©{ new Date().getFullYear() } </Text>
      <Text> { ProdName } </Text>
    </View>
  );

};

export default LicenseFooter;
