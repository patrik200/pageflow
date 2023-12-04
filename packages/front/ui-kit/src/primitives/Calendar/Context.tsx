import React from "react";
import { IntlDate } from "@worksolutions/utils";

export type AvailableCalendarLanguages = "ru" | "en";

export interface CalendarContextInterface {
  language: AvailableCalendarLanguages;
  intlDate: IntlDate;
}

export const CalendarContext = React.createContext<CalendarContextInterface>(null!);
