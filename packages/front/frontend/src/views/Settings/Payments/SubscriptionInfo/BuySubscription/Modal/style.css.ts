import { style } from "@vanilla-extract/css";
import { body2regularStyles, globalThemeColorVars } from "@app/ui-kit";

export const descriptionStyles = style([
  body2regularStyles,
  {
    color: globalThemeColorVars.textSecondary,
    maxWidth: 510,
    whiteSpace: "pre-wrap",
  },
]);

export const paymentMethodsWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 12,
  marginTop: 24,
});
