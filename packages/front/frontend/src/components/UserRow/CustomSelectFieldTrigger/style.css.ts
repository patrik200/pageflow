import { style } from "@vanilla-extract/css";
import {
  body2mediumStyles,
  button1mediumStyles,
  globalThemeColorVars,
  typographyOptionalStyleVariants,
} from "@app/ui-kit";

export const inputFieldWrapperStyles = style({
  cursor: "pointer",
  height: "unset",
});

export const contentWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
});

export const primaryTextStyles = style([
  body2mediumStyles,
  {
    color: "inherit",
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
