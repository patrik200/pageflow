import { style } from "@vanilla-extract/css";
import {
  body2regularStyles,
  button1mediumStyles,
  globalThemeColorVars,
  typographyOptionalStyleVariants,
} from "@app/ui-kit";

export const contentWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
});

export const primaryTextStyles = style([
  body2regularStyles,
  {
    color: globalThemeColorVars.textPrimary,
  },
]);

export const secondaryTextStyles = style([
  button1mediumStyles,
  {
    color: globalThemeColorVars.textSecondary,
    marginTop: -2,
  },
]);

export const textDotsStyles = style([typographyOptionalStyleVariants.textDots, { display: "inline-block" }]);
