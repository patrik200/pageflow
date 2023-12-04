import { style } from "@vanilla-extract/css";
import { body2regularStyles, globalThemeColorVars, h4mediumStyles } from "@app/ui-kit";

export const cardStyles = style({
  alignSelf: "flex-start",
});

export const titleStyles = style([h4mediumStyles]);

export const nextPaymentDateStyles = style([
  body2regularStyles,
  { marginTop: 12, color: globalThemeColorVars.textSecondary },
]);
