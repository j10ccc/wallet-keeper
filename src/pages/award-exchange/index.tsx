import PageView from "@/components/PageView";
import mock from "@/mock/index";
import { View, Text, ScrollView, Image } from "@tarojs/components";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { AtIcon } from "taro-ui";
import styles from "./index.module.scss";
import Taro from "@tarojs/taro";

const valueTransform = (value: number) => {
  if (value >= Math.pow(10, 4)) return `${Math.floor(value / Math.pow(10, 4))}W`;
  return value.toString();
};

const AwardExangePage = () => {
  const [awards, setAwards] = useState<AwardAPI.Award[]>([]);

  useEffect(() => {
    const res = mock.AwardMock.awardList;
    setAwards(res);
  }, []);

  const handleClickExchange = () => {
    Taro.showModal({
      title: "提示",
      content: "确认兑换此物品?"
    });

  };

  return (
    <PageView>
      <ScrollView className={styles.scroll}>
        <View className={styles.tip}>
          <View className={styles.header}>
            <AtIcon prefixClass="icon" value="marketing" />
            <View>
              <Text>公告栏</Text>
            </View>
          </View>
        </View>
        <View className={styles.container}>
          <View className={styles.header}>
            <View className={classNames([styles.tab, styles.current])}>惊喜好物</View>
            <View className={styles.tab}>小二道具</View>
          </View>
          <View className={styles.body}>
            { awards.map(item =>
              <View key={item.name } className={styles.wrapper}>
                <View className={styles.card}>
                  <View className={styles.row}>
                    <View className={styles["image-wrapper"]}>
                      <Image src={item.image} className={styles.image}/>
                    </View>
                  </View>
                  <View className={styles.row}>
                    <View className={styles.name}>{item.name} </View>
                  </View>
                  <View className={styles.values}>
                    <View className={styles.value}> 🪨 {valueTransform(item.value)}</View>
                    <View className={styles.origin}>{valueTransform(item.originValue)} </View>
                  </View>
                  <View className={styles.action}>
                    <View className={styles.btn} onClick={handleClickExchange}>
                      <Text> 兑换 </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>

        </View>
      </ScrollView>

    </PageView>
  );

};

export default AwardExangePage;
