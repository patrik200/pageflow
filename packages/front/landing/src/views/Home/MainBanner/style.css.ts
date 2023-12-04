import { style } from "@vanilla-extract/css";
import { padding } from "polished";

import { globalThemeColorVars } from "styles";

export const wrapperStyles = style({
  zIndex: 0,
  position: "relative",
  width: "100%",
  minHeight: 600,
  overflow: "hidden",
  marginTop: -70,
  ...padding(0, 10),

  "@media": {
    "screen and (max-width: 768px)": {
      minHeight: 300,
    },
  },
});

export const circleStyles = style({
  zIndex: -1,
  position: "absolute",
  bottom: "5%",
  top: "-40%",
  left: "-60%",
  right: "-60%",
  borderRadius: "100%",
  background: globalThemeColorVars.primary,
  opacity: 0.08,
});

export const contentStyles = style({
  maxWidth: 1180,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  margin: "0 auto",
  marginTop: 142,
});

export const titleStyles = style({
  fontSize: 64,
  textAlign: "center",
  fontWeight: "600",

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: 24,
    },
  },
});

export const descriptionStyles = style({
  fontSize: 24,
  textAlign: "center",
  maxWidth: 740,
  lineHeight: 1.4,
  marginTop: 12,

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: 16,
    },
  },
});

export const tryButtonStyles = style({
  fontFamily: "Roboto, sans-serif",
  marginTop: 48,
  outline: "none",
  background: globalThemeColorVars.primary,
  color: globalThemeColorVars.textInverse,
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
  color: globalThemeColorVars.textSecondary,
  fontSize: 14,
  marginTop: 12,

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: 12,
    },
  },
});
