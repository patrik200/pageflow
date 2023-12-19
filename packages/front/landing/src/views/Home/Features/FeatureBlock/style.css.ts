import { style } from "@vanilla-extract/css";
import { padding, margin } from "polished";

import { globalThemeColorVars } from "styles";

export const wrapperStyles = style({
  width: "calc(100% - 48px)",
  display: "flex",
  justifyContent: "center",
  ...padding(64, 16),
  ...margin(0, 24),

  "@media": {
    "screen and (max-width: 768px)": {
      width: "calc(100% - 32px)",
      ...margin(0, 16),
    },
  },
});

export const lightWrapperStyles = style({
  background: "white",
  boxShadow: "0px 1px 5px 0px rgba(46, 71, 81, 0.06)",
  borderRadius: 24,
});

export const contentStyles = style({
  width: "100%",
  display: "flex",
  gap: 125,
  maxWidth: 1120,

  "@media": {
    "screen and (max-width: 768px)": {
      flexDirection: "column",
      ...padding(null, 10),
      gap: 16,
    },
  },
});

export const textWrapperStyles = style({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  paddingTop: 70,
});

export const numberStyles = style({
  fontSize: 172,
  color: globalThemeColorVars.primary,
  opacity: 0.1,
  fontWeight: 300,
  lineHeight: "90%",
});

export const numberWrapperStyles = style({
  position: "absolute",
  left: 0,
  top: 0,
  zIndex: 0,
});

export const numberBackgroundWrapperStyles = style({
  background: `linear-gradient(transparent, ${globalThemeColorVars.background})`,
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
});

export const lightNumberBackgroundWrapperStyles = style({
  background: "linear-gradient(transparent, white)",
});

export const titleStyles = style({
  fontSize: 32,
  fontWeight: "600",
  lineHeight: "110%",
  zIndex: 1,

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: 20,
      marginTop: 12,
    },
  },
});

export const bodyStyles = style({
  fontSize: 18,
  fontWeight: "400",
  lineHeight: "140%",
  marginTop: 24,
  whiteSpace: "pre-wrap",
  zIndex: 1,

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: 14,
    },
  },
});

export const captionWrapperStyles = style({
  display: "flex",
  gap: 8,
  boxShadow: "0px 1px 5px 0px rgba(46, 71, 81, 0.06)",
  background: "white",
  borderRadius: 12,
  marginTop: 12,
  ...padding(12),
});

export const captionLightWrapperStyles = style({
  boxShadow: "0px 1px 5px 0px rgba(46, 71, 81, 0.06)",
  background: globalThemeColorVars.background,
});

export const captionStyles = style({
  lineHeight: "24px",
  color: globalThemeColorVars.primary,
  fontSize: 18,

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: 14,
    },
  },
});

export const iconStyles = style({
  fill: globalThemeColorVars.primary,
  width: 24,
  minWidth: 24,
  height: 24,
  minHeight: 24,
});

export const imageStyles = style({
  borderRadius: 8,
  width: 540,
  objectFit: "contain",

  "@media": {
    "screen and (max-width: 768px)": {
      width: "100%",
      maxWidth: 500,
    },
  },
});

export const desktopOnlyImageStyles = style({
  display: "flex",
  "@media": {
    "screen and (max-width: 768px)": {
      display: "none",
    },
  },
});

export const mobileOnlyImageStyles = style({
  display: "none",
  "@media": {
    "screen and (max-width: 768px)": {
      display: "flex",
    },
  },
});
