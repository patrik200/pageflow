import { style } from "@vanilla-extract/css";
import { padding } from "polished";

import { globalThemeColorVars } from "styles";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

export const titleStyles = style([
  {
    paddingLeft: 12,
    fontSize: 14,
    whiteSpace: "nowrap",
  },
]);

export const inputWrapperStyles = style({
  display: "flex",
  alignItems: "center",
  borderRadius: 12,
  border: "1px solid " + globalThemeColorVars.strokeLight,
  background: globalThemeColorVars.textInverse,
});

export const inputStyles = style({
  background: "transparent",
  border: "none",
  flex: 1,
  height: 44,
  outline: "none",
  ...padding(null, 12),
  fontSize: 16,
  color: globalThemeColorVars.textPrimary,
  minWidth: 40,
});

export const errorStyles = style({
  color: globalThemeColorVars.red,
  fontSize: 14,
  paddingLeft: 12,
});
