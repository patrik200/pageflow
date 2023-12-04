import { style } from "@vanilla-extract/css";

import { globalThemeColorVars } from "styles";

export const wrapperStyles = style({
  display: "flex",
  cursor: "pointer",
  alignItems: "flex-start",
  gap: 8,
});

export const checkboxWrapperStyles = style({
  border: "2px solid " + globalThemeColorVars.strokeLight,
  width: 19,
  height: 19,
  minWidth: 19,
  minHeight: 19,
  borderRadius: 4,
});

export const iconWrapperStyles = style({
  fill: globalThemeColorVars.primary,
  transform: "scale(1.1)",
  strokeWidth: 1,
});

export const errorStyles = style({
  color: globalThemeColorVars.red,
  fontSize: 14,
  paddingLeft: 28,
});
