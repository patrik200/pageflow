import { style } from "@vanilla-extract/css";
import { body3regularStyles, globalThemeColorVars } from "@app/ui-kit";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 16,
});

export const includeWeekendsErrorStyle = style([
  body3regularStyles,
  {
    color: globalThemeColorVars.red,
  },
]);

export const addRowActionStyles = style({
  alignSelf: "flex-end",
});
