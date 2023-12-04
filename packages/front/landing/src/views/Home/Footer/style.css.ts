import { style } from "@vanilla-extract/css";
import { padding } from "polished";

import { globalThemeColorVars } from "styles";

export const footerWrapperStyles = style({
  display: "flex",
  justifyContent: "center",
  background: "#1892a30d",
  ...padding(56, 10),

  "@media": {
    "screen and (max-width: 768px)": {
      ...padding(32, 10),
    },
  },
});

export const footerContentWrapperStyles = style({
  maxWidth: 700,
  width: "100%",
  display: "flex",
  justifyContent: "space-between",

  "@media": {
    "screen and (max-width: 768px)": {
      justifyContent: "unset",
      gap: 24,
      flexDirection: "column",
    },
  },
});

export const linkWrapperStyles = style({
  display: "flex",
  gap: 6,
  flexDirection: "column",
});

export const footerTitleStyles = style({
  fontSize: 20,
  fontWeight: 700,
  color: globalThemeColorVars.textPrimary,
  marginBottom: 8,

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: 18,
    },
  },
});

export const footerTextStyles = style({
  fontSize: 14,
  color: globalThemeColorVars.textPrimary,
  textDecoration: "none",

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: 12,
    },
  },
});

export const footerTextMarginStyles = style({
  marginTop: 12,
});
