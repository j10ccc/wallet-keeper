import PageView from "@/components/PageView";
import { CalendarView } from "@/components/atoms";
import { CurrencyName } from "@/constants/Things";
import { View, Text, ScrollView } from "@tarojs/components";
import styles from "./index.module.scss";
import DayUtils from "@/utils/DayUtils";
import { AtIcon } from "taro-ui";
import dayjs, { Dayjs } from "dayjs";
import LicenseFooter from "@/components/LicenseFooter";
import Taro from "@tarojs/taro";
import { useClockIn } from "@/stores/useClockIn";
import { useEffect, useRef, useState } from "react";
import mock from "@/mock/index";
import classNames from "classnames";

const countConstantDates = (dates: string[]) => {
  let tmp: string | undefined = undefined;
  let count = 0;

  dates.slice().reverse().find(item => {
    if (tmp) {
      if (!dayjs(item).isSame(dayjs(tmp).subtract(1, "day"), "day"))
        return true;
    }
    tmp = item;
    count++;
  });
  return count;
};

const checkClockin = (dates: string[], day: Dayjs = dayjs()) => {
  if (dayjs(dates[dates.length - 1]).isSame(day, "day")) {
    return true;
  } else {
    return false;
  }
};

const ClockinPage = () => {
  console.log("render");
  const today = DayUtils.getToday();
  const { dates, setDates, clockIn } = useClockIn();
  const isTodayClockIn = useRef(checkClockin(dates));
  const [countOfConstantDates, setCountOfConstantDates] = useState(
    countConstantDates(dates)
  );

  useEffect(() => {
    if (dates?.length) return;
    const data = mock.ClockInMock.dates;
    setDates(data);
  }, []);

  useEffect(() => {
    isTodayClockIn.current = checkClockin(dates);
    setCountOfConstantDates(countConstantDates(dates));
  }, [dates]);


  const handleRenderDay = (date: Dayjs) => {
    const day = dates.find(item => {
      return date.isSame(item, "day");
    });
    if (day) {
      return <AtIcon
        prefixClass="icon"
        value="ok"
        size={20}
        color={ !dayjs(day).isSame(today, "day") ? "#e2ad49" : "#fff" }
      />;
    } else {
      return undefined;
    }
  };

  const handleClickExchange = () => {
    Taro.navigateTo({
      url: "/pages/grocery/index"
    });
  };

  const handleClickClockIn = () => {
    if (isTodayClockIn.current) return;
    clockIn(dayjs().format("YYYY-MM-DD"));
  };

  return (
    <PageView>
      <ScrollView scrollY className={styles.scroll}>
        <View className={styles.header}>
          <View className={styles.top}></View>
          <View className={styles.grid}>
            <View className={styles.item}>
              <Text className={styles.text}>连续签到天数</Text>
              <Text className={styles.content}>{ countOfConstantDates }</Text>
            </View>
            <View className={styles.item}>
              <Text className={styles.text}>当前{ CurrencyName }数</Text>
              <Text className={styles.content}>123133</Text>
            </View>
          </View>
          <View className={styles.bottom}>
            <View className={styles.actions}>
              <View className={styles.btn} onClick={handleClickExchange}>
                <Text>去兑换</Text>
              </View>
            </View>
          </View>
        </View>
        <View className={styles.body}>
          <View className={styles.calendar}>
            <View className={styles.date}>
              <View className={styles.text}> { today.format("YYYY年 M月") }</View>
            </View>
            <CalendarView renderDay={handleRenderDay}/>
          </View>
          <View className={styles.actions}>
            <View
              className={
                classNames([
                  styles.btn,
                  isTodayClockIn.current && styles.disabled
                ])
              } onClick={handleClickClockIn}
            >
              { !isTodayClockIn.current ? <Text>签到</Text> :
                <Text>已连续签到 { countOfConstantDates } 天</Text>
              }
            </View>
          </View>
        </View>
        <View className={styles.footer}>
          <LicenseFooter />
        </View>
      </ScrollView>
    </PageView>
  );

};

export default ClockinPage;
