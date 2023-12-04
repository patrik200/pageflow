import { DateMode, IntlDate } from "@worksolutions/utils";

export const europeDateFormats: Record<DateMode, string | Symbol> = {
  DAY_WITH_STRING_MONTH: "dd MMMM",
  DAY_WITH_STRING_SHORT_MONTH: "dd MMM",
  DATE: "dd.MM.yyyy",
  DATE_WITH_STRING_MONTH: "dd MMMM yyyy",
  DATE_WITH_STRING_SHORT_MONTH: "dd MMM yyyy",
  TIME: "HH:mm",
  TIME_WITH_SECONDS: "HH:mm:ss",
  DATE_TIME: "dd.MM.yyyy HH:mm",
  DATE_TIME_WITH_SECONDS: "dd.MM.yyyy HH:mm:ss",
  DATE_TIME_WITH_STRING_MONTH: "dd MMMM yyyy HH:mm",
  DATE_TIME_WITH_STRING_MONTH_WITH_SECONDS: "dd MMMM yyyy HH:mm:ss",
  DATE_TIME_WITH_STRING_SHORT_MONTH: "dd MMM yyyy HH:mm",
  DATE_TIME_WITH_STRING_SHORT_MONTH_WITH_SECONDS: "dd MMM yyyy HH:mm:ss",
  HOURS: "HH",
  SHORT_HOURS: "H",
  MINUTES: "mm",
  SHORT_MINUTES: "m",
  ...IntlDate.universalDates,
};
