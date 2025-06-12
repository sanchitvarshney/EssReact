export const helperFun = {
  formatTimeRange: (startTimeStr: any, endTimeStr: any) => {
    const start = new Date(startTimeStr);
    const end = new Date(endTimeStr);

    const options: any = {
      hour: "numeric",
      minute: "2-digit",
      second:"2-digit",
      hour12: false,
    };

    const startTimeFormatted = start.toLocaleTimeString("en-US", options);
    const endTimeFormatted = end.toLocaleTimeString("en-US", options);

    return `${startTimeFormatted} to ${endTimeFormatted}`;
  },
};
