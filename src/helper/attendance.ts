import moment from "moment";

export const isUpcomingAbsent = (start: unknown, status: unknown) =>
  !!start &&
  String(status ?? "").trim().toLowerCase() === "a" &&
  moment(start as moment.MomentInput).isAfter(moment(), "day");
