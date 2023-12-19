import { style } from "@vanilla-extract/css";
import { padding, margin } from "polished";

import { globalThemeColorVars } from "styles";

export const wrapperStyles = style({
  width: "calc(100% - 48px)",
  display: "flex",
  justifyContent: "center",
  background: "white",
  boxShadow: "0px 1px 5px 0px rgba(46, 71, 81, 0.06)",
  borderRadius: 24,
  ...padding(64, 16),
  ...margin(48, 24, 0, 24),

  "@media": {
    "screen and (max-width: 768px)": {
      width: "calc(100% - 32px)",
      ...margin(24, 16, 0, 16),
    },
  },
});

export const contentStyles = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 48,

  "@media": {
    "screen and (max-width: 768px)": {
      flexDirection: "column",
      ...padding(null, 10),
      gap: 32,
    },
  },
});

export const titleTextStyles = style({
  fontSize: 48,
  lineHeight: "110%",
  letterSpacing: "1%",
  fontWeight: 500,

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: 24,
    },
  },
});

export const highlightedTitleTextStyles = style({
  color: globalThemeColorVars.primary,
});

export const bodyWrapperStyles = style({
  display: "flex",
  gap: 48,
  alignItems: "center",

  "@media": {
    "screen and (max-width: 768px)": {
      flexDirection: "column",
    },
  },
});

export const leftSideWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 24,
  flex: 1,
  maxWidth: 400,
});

export const leftSideTitleStyles = style({
  fontSize: 32,
  lineHeight: "110%",
  letterSpacing: "1%",
  fontWeight: 500,

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: 20,
      textAlign: "center",
    },
  },
});

export const leftSidePriceTextStyles = style({
  fontSize: 96,
  lineHeight: "90%",
  fontWeight: 500,
  color: globalThemeColorVars.primary,

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: 64,
      width: "100%",
      textAlign: "center",
    },
  },
});

export const leftSideUnderPriceTextStyles = style({
  fontSize: 18,
  lineHeight: "140%",
  marginTop: 8,
  display: "block",

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: 14,
      width: "100%",
      textAlign: "center",
    },
  },
});

export const leftSidePurchaseButtonStyles = style({
  width: 242,
  height: 53,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: globalThemeColorVars.primary,
  borderRadius: 8,
  cursor: "pointer",
  border: 0,
  outline: 0,

  "@media": {
    "screen and (max-width: 768px)": {
      margin: "0 auto",
    },
  },
});

export const leftSidePurchaseButtonTextStyles = style({
  fontSize: 18,
  lineHeight: "160%",
  fontWeight: 600,
  color: globalThemeColorVars.textInverse,
});

export const featuresWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 14,
  flex: 1,
  maxWidth: 400,

  "@media": {
    "screen and (max-width: 768px)": {
      maxWidth: "auto",
    },
  },
});

export const featureStyles = style({
  display: "flex",
  gap: 12,
});

export const featureTextStyles = style({
  lineHeight: "24px",
  flex: 1,
});
