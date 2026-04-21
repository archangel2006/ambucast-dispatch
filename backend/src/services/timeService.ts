export const getTimeData = () => {
  const now = new Date();
      console.log("3")


  return {
    hour: now.getHours(),
    day_of_week: now.getDay()
  };
};