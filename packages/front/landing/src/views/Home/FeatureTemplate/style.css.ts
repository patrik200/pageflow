import { style, styleVariants } from "@vanilla-extract/css";
import { padding } from "polished";

import { globalThemeColorVars } from "styles";

export const wrapperStyles = style({
  display: "flex",
  gap: 50,
  width: "100%",
  maxWidth: 1180,
  margin: "0 auto",
  alignItems: "center",
  ...padding(null, 16),

  "@media": {
    "screen and (max-width: 768px)": {
      flexDirection: "column",
      ...padding(null, 10),
      gap: 16,
    },
  },
});

export const textWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  marginTop: -20,
  width: "100%",
});

export const preTitleStyles = style({
  fontSize: 14,
  color: globalThemeColorVars.textSecondary,
  fontWeight: "600",
});

export const titleStyles = style({
  fontSize: 32,
  fontWeight: "600",
  lineHeight: "140%",
  marginTop: 24,

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: 20,
      marginTop: 12,
    },
  },
});

export const textStyles = style({
  fontSize: 22,
  fontWeight: "400",
  lineHeight: "120%",
  marginTop: 8,
  whiteSpace: "pre-wrap",

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: 14,
    },
  },
});

export const imageStyles = style({
  borderRadius: 8,
  "@media": {
    "screen and (max-width: 768px)": {
      width: "100%",
      maxWidth: 500,
    },
  },
});

export const imageSizeStyleVariants = styleVariants({
  medium: {
    width: 526,
  },
  large: {
    width: 580,
  },
  extra: {
    width: 650,
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
