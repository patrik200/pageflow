import { style } from "@vanilla-extract/css";
import { padding } from "polished";

import { globalThemeColorVars } from "styles";

export const wrapperStyles = style({
  width: "100%",
  ...padding(80, 16),
  background: globalThemeColorVars.primary,
  marginTop: 160,

  "@media": {
    "screen and (max-width: 768px)": {
      marginTop: 80,
      ...padding(60, 16),
    },
  },
});

export const contentStyles = style({
  margin: "0 auto",
  maxWidth: 740,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

export const titleStyles = style({
  fontSize: 64,
  textAlign: "center",
  fontWeight: "600",
  color: globalThemeColorVars.textInverse,

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: 24,
    },
  },
});

export const tryButtonStyles = style({
  fontFamily: "Roboto, sans-serif",
  marginTop: 48,
  outline: "none",
  background: globalThemeColorVars.textInverse,
  color: globalThemeColorVars.primary,
  borderRadius: 16,
  ...padding(27, 50),
  fontSize: 20,
  fontWeight: "700",
  cursor: "pointer",
  border: "none",
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 4px -2px, rgba(0, 0, 0, 0.1) 0px 8px 16px 0px",

  "@media": {
    "screen and (max-width: 768px)": {
      marginTop: 24,
      ...padding(16, 24),
    },
  },
});

export const buttonInfoTextStyles = style({
  textAlign: "center",
  color: globalThemeColorVars.textInverse,
  fontSize: 14,
  marginTop: 12,

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: 12,
    },
  },
});
