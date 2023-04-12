import dayjs, { Dayjs } from "dayjs";

const getToday = () => {
  return dayjs();
};

/** get sunday's 23'59'59 */
const getThisWeekEndTime = () => {
  return getToday().locale({ name: "zh-cn", weekStart: 1 }).endOf("week");
};

const getThisWeekStartTime = () => {
  return getToday().locale({ name: "zh-cn", weekStart: 1 }).startOf("week");

};

const getDatesInCalenderView = (currentDate: Dayjs) => {

  const result: Dayjs[][] = [[], [], []];
  const firstDay = currentDate.startOf("month");
  const lastDay = currentDate.endOf("month");

  for (let i = firstDay.day(); i > 0; i--) {
    result[0].push(firstDay.subtract(i, "day"));
  }

  for (let i = 0; i < firstDay.daysInMonth(); i++) {
    result[1].push(firstDay.add(i, "day"));
  }

  for (let i = 1; i <= 6 - lastDay.day(); i++) {
    result[2].push(lastDay.add(i, "day"));
  }

  return {
    previous: result[0],
    current: result[1],
    next: result[2]
  };
};

export default {
  getToday,
  getThisWeekStartTime,
  getThisWeekEndTime,
  getDatesInCalenderView
};
