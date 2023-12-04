import { globalThemeColorVars, subtitle1regularStyles } from "@app/ui-kit";
import { style } from "@vanilla-extract/css";

export const deadlineDaysAmountStyles = style([
  subtitle1regularStyles,
  {
    color: globalThemeColorVars.textSecondary,
    paddingTop: 3,
  },
]);
