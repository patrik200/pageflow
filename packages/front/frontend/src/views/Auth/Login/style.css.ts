import { style } from "@vanilla-extract/css";
import { body2mediumStyles, globalThemeColorVars } from "@app/ui-kit";

export const formStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 24,
});

export const actionStyles = style({
  marginTop: 16,
});

export const restorePasswordStyles = style([body2mediumStyles, { color: globalThemeColorVars.primary }]);
