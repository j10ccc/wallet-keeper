import { View, Text } from "@tarojs/components";
import styles from "./index.module.scss";
import { Weekdays } from "@/constants/DateChars";
import dayjs, { Dayjs } from "dayjs";
import { useRef, memo, ReactNode, useEffect } from "react";
import DayUtils from "@/utils/DayUtils";
import classNames from "classnames";

type PropsType = {
  currentDate?: Dayjs;
  renderDay?: (date: Dayjs) => ReactNode;
}

const CalendarView = (props: PropsType) => {
  const { currentDate = dayjs(), renderDay } = props;

  const weekdayChars = [[...Weekdays].pop(), ...Weekdays.slice(0, -1)]
    .map(item => item![item!.length - 1]);

  const today = DayUtils.getToday();

  const dateChars = useRef(DayUtils.getDatesInCalenderView(currentDate || dayjs()));

  useEffect(() => {
    dateChars.current = DayUtils.getDatesInCalenderView(currentDate);
  }, [currentDate]);

  return (
    <View className={styles.container}>
      <View className={styles.body}>
        <View className={styles.grid}>
          { weekdayChars.map(item =>
            <View key={`weekday-${item}`}
              className={classNames([
                styles.weekday,
                styles.item,
              ])}>
              <Text> {item} </Text>
            </View>
          )}
          { dateChars.current?.previous.map(item => {
            const element =  renderDay?.(item);
            return <View
              className={classNames([
                styles.day,
                styles.item,
                today.isSame(item, "day") && styles.today
              ])}
              key={item.toString()}>
              <View className={styles.text}>
                { element === undefined ? <Text>{ item.date() }</Text> : element }
              </View>
            </View>;
          }
          )}
          { dateChars.current?.current.map(item => {
            const element =  renderDay?.(item);

            return <View
              className={classNames([
                styles.day,
                styles.current,
                styles.item,
                today.isSame(item, "day") && styles.today
              ])}
              key={item.toString()}>
              <View className={styles.text}>
                { element === undefined ? <Text>{ item.date() }</Text> : element }
              </View>
            </View>;
          }
          )}
          { dateChars.current?.next.map(item => {
            const element =  renderDay?.(item);

            return <View
              className={classNames([
                styles.day,
                styles.item,
                today.isSame(item, "day") && styles.today
              ])}
              key={item.toString()}
            >
              <View className={styles.text}>
                { element === undefined ? <Text>{ item.date() }</Text> : element }
              </View>
            </View>;
          }
          )}
        </View>
      </View>

    </View>
  );
};

export default memo(CalendarView);
