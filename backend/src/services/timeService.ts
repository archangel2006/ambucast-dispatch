export const getTimeData = () => {
  const now = new Date();

  return {
    hour: now.getHours(),
    day_of_week: now.getDay()
  };
};