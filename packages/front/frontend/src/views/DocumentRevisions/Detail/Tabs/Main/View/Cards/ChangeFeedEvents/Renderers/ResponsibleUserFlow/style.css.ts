import { style } from "@vanilla-extract/css";
import { body3regularStyles, globalThemeColorVars } from "@app/ui-kit";

export const rowStyles = style({
  display: "flex",
  gap: 6,
  flexDirection: "column",
});

export const titleTextStyles = style([body3regularStyles, { color: globalThemeColorVars.textSecondary, width: 100 }]);
