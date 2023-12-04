import { style } from "@vanilla-extract/css";
import { body2regularStyles, body3regularStyles, globalThemeColorVars } from "@app/ui-kit";

export const valueStyles = style([body2regularStyles, { whiteSpace: "pre-wrap" }]);

export const emptyValueStyles = style([valueStyles, { color: globalThemeColorVars.textSecondary }]);

export const textFieldStyles = style({
  flex: 1,
});

export const editViewRightItemTextStyles = style([body3regularStyles, { color: globalThemeColorVars.textSecondary }]);
