import { style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "styles";

import { body2regularStyles } from "primitives/Typography/css/index.css";

export const typographyStyles = style([
  body2regularStyles,
  {
    color: globalThemeColorVars.textSecondary,
    marginBottom: 8,
  },
]);

export const requiredAsteriskStyle = style({
  selectors: {
    "&:after": {
      content: "*",
      color: globalThemeColorVars.red,
      position: "relative",
      left: "2px",
      top: "-2px",
    },
  },
});
