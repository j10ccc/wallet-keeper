import dayjs from "dayjs";

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

export default {
  getToday,
  getThisWeekStartTime,
  getThisWeekEndTime
};
