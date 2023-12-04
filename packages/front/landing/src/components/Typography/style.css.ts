import { style } from "@vanilla-extract/css";

import { globalThemeColorVars } from "styles";

export const typographyStyles = style({
  fontFamily: "Roboto, sans-serif",
  display: "inline-block",
  color: globalThemeColorVars.textPrimary,
});
