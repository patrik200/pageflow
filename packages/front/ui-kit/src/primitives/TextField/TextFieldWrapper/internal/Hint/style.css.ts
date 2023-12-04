import { style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "styles";

import { body2regularStyles } from "primitives/Typography/css/index.css";

export const textStyles = style([
  body2regularStyles,
  {
    marginTop: 4,
    color: globalThemeColorVars.textSecondary,
  },
]);
