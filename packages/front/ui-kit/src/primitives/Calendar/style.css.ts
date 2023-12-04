import { globalStyle, style } from "@vanilla-extract/css";
import { borderRadius, padding } from "polished";
import { globalThemeColorVars } from "styles";

import { spinnerMedium } from "primitives/Spinner/theme.css";
import { body2regular } from "primitives/Typography/css/common.css";

import { boxShadow } from "utils";

export const calendarStyles = style({
  display: "flex",
  gap: 8,
  ...padding(8, 8, 4, 8),
  borderRadius: 8,
  backgroundColor: globalThemeColorVars.backgroundCard,
  border: "1px solid " + globalThemeColorVars.strokeLight,
  boxShadow: boxShadow({ y: 3, blur: 10, color: globalThemeColorVars.defaultShadow }),
});

export const spinnerStyles = style([spinnerMedium.className]);

export const presetsStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 4,
});

globalStyle(`${calendarStyles} > :not(${presetsStyles})`, { flex: 1 });

globalStyle(".react-datepicker", {
  paddingTop: 8,
  display: "flex",
  flexDirection: "column",
  position: "relative",
});

globalStyle(".react-datepicker__navigation", {
  background: "none",
  cursor: "pointer",
  border: "none",
  position: "absolute",
  width: 32,
  height: 32,
  top: -1,
  color: "transparent",
});

globalStyle(".react-datepicker__navigation:before", {
  borderColor: globalThemeColorVars.strokePrimary,
  borderStyle: "solid",
  borderWidth: "3px 3px 0 0",
  content: "",
  display: "block",
  height: 10,
  width: 10,
  position: "absolute",
  top: 11,
  transition: "opacity 0.2s",
  opacity: 0.8,
});
globalStyle(".react-datepicker__navigation:hover:before", { opacity: 0.6 });

globalStyle(".react-datepicker__navigation--previous", {
  left: "calc(100% / 7 - 100% / 14)",
  transform: "translateX(-50%)",
});
globalStyle(".react-datepicker__navigation--previous:before", { transform: "rotate(-135deg)", right: 8 });

globalStyle(".react-datepicker__navigation--next", {
  left: "calc(100% - 100% / 7 + 100% / 14)",
  transform: "translateX(-50%)",
});
globalStyle(".react-datepicker__navigation--next:before", { transform: "rotate(45deg)", left: 8 });

globalStyle(".react-datepicker__current-month", {
  ...body2regular,
  textAlign: "center",
  color: globalThemeColorVars.textPrimary,
  marginTop: -3,
  marginBottom: 17,
});

globalStyle(".react-datepicker__day-names", {
  display: "flex",
  marginTop: 14,
  color: globalThemeColorVars.textPrimary,
});
globalStyle(".react-datepicker__day-name", {
  ...body2regular,
  fontWeight: 500,
  flex: 1,
  textAlign: "center",
});

globalStyle(".react-datepicker__month", {
  marginTop: 14,
});
globalStyle(".react-datepicker__week", {
  display: "flex",
});

globalStyle(".react-datepicker__day", {
  ...body2regular,
  display: "flex",
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  transition: "background-color 200ms, border-radius 200ms, color 200ms",
  margin: 4,
  borderRadius: 6,
  color: globalThemeColorVars.textPrimary,
  minWidth: 34,
  minHeight: 34,
});
globalStyle(".react-datepicker__day:not(.react-datepicker__day--disabled)", {
  cursor: "pointer",
});
globalStyle(
  ".react-datepicker__day:not(.react-datepicker__day--selected, .react-datepicker__day--disabled, .react-datepicker__day--in-range, .react-datepicker__day--in-selecting-range):hover",
  {
    backgroundColor: globalThemeColorVars.primary10,
  },
);

globalStyle(".react-datepicker__day--weekend", {
  color: globalThemeColorVars.red,
});
globalStyle(".react-datepicker__day--selected", {
  color: globalThemeColorVars.textInversion,
  backgroundColor: globalThemeColorVars.primary,
});
globalStyle(".react-datepicker__day--outside-month", { opacity: 0.6 });
globalStyle(".react-datepicker__day--disabled", { opacity: 0.3 });
globalStyle(
  ".react-datepicker__day--today:not(.react-datepicker__day--selected, .react-datepicker__day--in-range, .react-datepicker__day--in-selecting-range)",
  {
    boxShadow: boxShadow({ spread: 1, color: globalThemeColorVars.green }),
  },
);

globalStyle(".react-datepicker__day--in-range, .react-datepicker__day--in-selecting-range", {
  backgroundColor: globalThemeColorVars.primary,
  color: globalThemeColorVars.textInversion,
});
globalStyle(".react-datepicker__day--range-start, .react-datepicker__day--selecting-range-start", {
  ...borderRadius("left", 20),
});
globalStyle(".react-datepicker__day--range-end", {
  ...borderRadius("right", 20),
});

globalStyle(".react-datepicker__aria-live", {
  display: "none",
});
