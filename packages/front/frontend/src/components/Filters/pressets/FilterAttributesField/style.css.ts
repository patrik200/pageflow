import { style } from "@vanilla-extract/css";
import { body2regularStyles, globalThemeColorVars } from "@app/ui-kit";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

export const titleStyles = style([
  body2regularStyles,
  {
    color: globalThemeColorVars.textSecondary,
  },
]);

export const attributesStyles = style({
  display: "flex",
  flexWrap: "wrap",
  gap: 6,
});
