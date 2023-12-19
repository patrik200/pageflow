import { body2regularStyles, globalThemeColorVars } from "@app/ui-kit";
import { style } from "@vanilla-extract/css";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
});

export const emptyValueStyles = style([body2regularStyles, { color: globalThemeColorVars.textSecondary }]);
