const useDay = (value: Date | string) => {
  const date = new Date(value);
  const day = date.setHours(0, 0, 0, 0);
  const today = new Date().setHours(0, 0, 0, 0);

  const isTheDayBeforeYesterday = day - today === -86400000 * 2;
  const isYesterday = day - today === -86400000;
  const isToday = day === today;
  const isTomorrow = day - today === 86400000 * 2;

  return {
    isTheDayBeforeYesterday,
    isYesterday,
    isToday,
    isTomorrow
  };
};

export default useDay;
