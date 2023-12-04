import { style } from "@vanilla-extract/css";

import { globalThemeColorVars } from "styles";

export const wrapperStyles = style({
  zIndex: 0,
  position: "relative",
  width: "100%",
  height: 600,
  overflow: "hidden",
  marginTop: -70,

  "@media": {
    "screen and (max-width: 768px)": {
      height: 300,
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
