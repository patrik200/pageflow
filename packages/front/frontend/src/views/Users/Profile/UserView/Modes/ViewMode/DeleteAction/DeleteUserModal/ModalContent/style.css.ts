import { style } from "@vanilla-extract/css";
import { body1regularStyles, globalThemeColorVars } from "@app/ui-kit";

export const wrapperStyles = style({
  marginTop: -20,
  minWidth: 450,
});

export const descriptionStyles = style([
  body1regularStyles,
  {
    color: globalThemeColorVars.textSecondary,
  },
]);
