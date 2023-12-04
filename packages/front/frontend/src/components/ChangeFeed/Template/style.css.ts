import { globalStyle, style } from "@vanilla-extract/css";
import { body3regularStyles, globalThemeColorVars } from "@app/ui-kit";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 10,
  marginBottom: 16,
});

export const topWrapperStyles = style({
  display: "flex",
  alignItems: "flex-start",
  gap: 16,
  justifyContent: "space-between",
});

export const createdTimeStyles = style([body3regularStyles, { color: globalThemeColorVars.textSecondary }]);

export const contentStyles = style({
  borderBottom: "1px solid " + globalThemeColorVars.strokeLight,
  marginLeft: 38,
  paddingBottom: 16,
});

globalStyle(`${wrapperStyles}:last-child`, { marginBottom: "unset" });
globalStyle(`${wrapperStyles}:last-child ${contentStyles}`, { borderBottom: "none" });
