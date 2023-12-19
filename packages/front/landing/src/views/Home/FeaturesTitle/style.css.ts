import { style } from "@vanilla-extract/css";
import { padding } from "polished";

import { globalThemeColorVars } from "styles";

export const wrapperStyles = style({
  margin: "0 auto",
  width: "100%",
  maxWidth: 1080,
  marginTop: 96,

  "@media": {
    "screen and (max-width: 768px)": {
      marginTop: 64,
    },
  },
});

export const titleStyles = style({
  fontSize: 48,
  fontWeight: 500,
  display: "block",
  letterSpacing: 0.48,
  lineHeight: "110%",
  color: globalThemeColorVars.primary,
  ...padding(0, 24),

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: 24,
      textAlign: "center",
    },
  },
});

export const subTitleStyles = style([
  titleStyles,
  {
    color: globalThemeColorVars.textPrimary,
  },
]);
