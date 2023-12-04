import { globalStyle, style } from "@vanilla-extract/css";
import { padding } from "polished";

import { globalThemeColorVars } from "../../../styles";

export const wrapperStyles = style({
  width: "100%",
  maxWidth: 900,
  margin: "0 auto",
  ...padding(70, 32),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  "@media": {
    "screen and (max-width: 768px)": {
      ...padding(60, 16),
    },
  },
});

export const titleStyles = style({
  textAlign: "center",
  fontSize: 40,
  fontWeight: "600",

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: 24,
    },
  },
});

export const formWrapperStyles = style({
  marginTop: 50,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 24,
  maxWidth: 700,
  width: "100%",

  "@media": {
    "screen and (max-width: 768px)": {
      gap: 12,
    },
  },
});

export const formInputsRowStyles = style({
  display: "flex",
  alignItems: "flex-start",
  gap: 24,
  width: "100%",

  "@media": {
    "screen and (max-width: 768px)": {
      flexDirection: "column",
      alignItems: "unset",
      gap: 12,
    },
  },
});

globalStyle(`${formInputsRowStyles} > *`, { flex: 1 });

export const domainFieldLeftTextStyles = style({
  color: globalThemeColorVars.textSecondary,
  paddingLeft: 12,
  marginRight: -8,
  lineHeight: "99%",
});

export const domainFieldRightTextStyles = style({
  color: globalThemeColorVars.textSecondary,
  paddingRight: 12,
  marginLeft: -8,
  lineHeight: "99%",
});

export const registerButtonStyles = style({
  marginTop: 40,
  fontFamily: "Roboto, sans-serif",
  outline: "none",
  background: globalThemeColorVars.primary,
  color: globalThemeColorVars.textInverse,
  borderRadius: 16,
  ...padding(16, 40),
  fontSize: 18,
  fontWeight: "700",
  cursor: "pointer",
  border: "none",
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 4px -2px, rgba(0, 0, 0, 0.1) 0px 8px 16px 0px",
  transition: "opacity 0.2s",
  selectors: {
    "&:disabled": { opacity: 0.5, cursor: "default" },
  },
});

export const successTextStyles = style({
  marginTop: 24,
});

export const errorTextStyles = style({
  marginTop: 24,
  color: globalThemeColorVars.red,
});

export const spinnerStyles = style({
  marginTop: 24,
});

export const checkboxWrapperStyles = style({
  marginTop: 24,
  display: "flex",
  maxWidth: 700,
  width: "100%",
});

export const checkboxTextStyles = style({
  fontSize: 14,
  lineHeight: "19px",
  color: globalThemeColorVars.textSecondary,
});

export const checkboxLinkStyles = style([
  checkboxTextStyles,
  {
    color: globalThemeColorVars.textPrimary,
  },
]);
