import { style, globalStyle } from "@vanilla-extract/css";
import { padding } from "polished";

import { globalThemeColorVars } from "styles";

export const footerContentWrapperStyles = style({
  display: "flex",
  justifyContent: "space-between",
  gap: 80,
  ...padding(0, 16),

  "@media": {
    "screen and (max-width: 768px)": {
      justifyContent: "unset",
      gap: 48,
      flexDirection: "column",
    },
  },
});

export const linkWrapperStyles = style({
  display: "flex",
  gap: 12,
  flexDirection: "column",
});

export const footerTitleStyles = style({
  fontSize: 18,
  fontWeight: 500,
  letterSpacing: "1%",
  color: globalThemeColorVars.textInverse,
  marginBottom: 12,

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: 18,
    },
  },
});

export const footerTextStyles = style({
  fontSize: 16,
  lineHeight: "24px",
  color: globalThemeColorVars.textInverse,
  textDecoration: "none",

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: 14,
    },
  },
});

export const navigationItemWrapperStyles = style({
  display: "flex",
  gap: 12,
});

globalStyle(`${navigationItemWrapperStyles} svg`, {
  minWidth: 24,
  minHeight: 24,
});

export const navigationItemFakeIconStyles = style({
  width: 24,
});

export const navigationItemWrapperToTopMarginStyles = style({
  marginTop: -14,
});
