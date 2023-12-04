import { style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "styles/theme/index.css";

import { body2regularStyles } from "primitives/Typography/css/index.css";

export const wrapperStyles = style({
  maxHeight: 500,
  gap: 16,
  border: "1px solid " + globalThemeColorVars.strokePrimary,
  padding: 24,
  minHeight: 300,
});

export const contentStyles = style([
  body2regularStyles,
  {
    display: "flex",
    flexDirection: "column",
    padding: 8,
  },
]);

export const subScrollStyles = style({
  maxHeight: 200,
  border: "1px solid " + globalThemeColorVars.strokeLight,
});
