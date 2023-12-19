import { style } from "@vanilla-extract/css";
import { padding, margin } from "polished";

import { globalThemeColorVars } from "styles";

export const wrapperStyles = style({
  position: "relative",
  width: "calc(100% - 48px)",
  background: 'url("/images/blocks/mainBanner/index.jpg")',
  backgroundPosition: "50%",
  backgroundSize: "cover",
  borderRadius: 24,
  height: 715,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  ...padding(32, 16),
  ...margin(24, 24, 0, 24),

  "@media": {
    "screen and (max-width: 768px)": {
      height: 568,
      width: "calc(100% - 32px)",
      ...margin(16, 16, 0, 16),
    },
  },
});

export const contentWrapperStyles = style({
  maxWidth: 1120,
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 132,

  "@media": {
    "screen and (max-width: 768px)": {
      gap: 64,
    },
  },
});

export const logoWrapperStyles = style({
  display: "flex",
  gap: 12,
  alignItems: "center",
});

export const logoImageStyles = style({
  width: 44,
});

export const logoTextStyles = style({
  fontSize: 24,
  fontWeight: "500",
  letterSpacing: 0.5,
  color: globalThemeColorVars.textInverse,
});

export const contentStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 24,

  "@media": {
    "screen and (max-width: 768px)": {
      gap: 8,
    },
  },
});

export const titleStyles = style({
  fontSize: 96,
  display: "block",
  fontWeight: "600",
  lineHeight: "87px",
  color: globalThemeColorVars.textInverse,

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: 64,
      lineHeight: "56px",
    },

    "screen and (max-width: 540px)": {
      fontSize: 32,
      lineHeight: "28px",
    },
  },
});

export const titleSystemTextStyles = style([
  titleStyles,
  {
    fontWeight: 200,
  },
]);

export const titleDocumentsTextStyles = style([
  titleStyles,
  {
    color: globalThemeColorVars.primary,
    textAlign: "right",
  },
]);

export const tryFreeWrapperStyles = style({
  display: "flex",
  marginTop: 24,
  gap: 20,
  alignItems: "center",
  justifyContent: "center",

  "@media": {
    "screen and (max-width: 768px)": {
      flexDirection: "column",
    },
  },
});

export const tryFreeSpacingStyles = style({
  flex: 1,
});

export const tryButtonStyles = style({
  fontFamily: "Roboto, sans-serif",
  height: 53,
  marginLeft: "auto",
  outline: "none",
  background: "transparent",
  color: globalThemeColorVars.textInverse,
  borderRadius: 8,
  fontSize: 18,
  ...padding(0, 24),
  fontWeight: 600,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  position: "relative",
  border: `2px solid ${globalThemeColorVars.primary}`,

  "@media": {
    "screen and (max-width: 768px)": {
      marginTop: 24,
      ...padding(16, 24),
      fontSize: 16,
    },
  },
});

export const tryButtonTextStyles = style({
  zIndex: 1,
});

export const tryButtonShadowStyles = style({
  position: "absolute",
  width: "100%",
  height: "100%",
  borderRadius: "100%",
  background: "radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.52) 0%, rgba(0, 0, 0, 0.00) 100%)",
  filter: "blur(26px)",
});

export const tryFreeDividerStyles = style({
  width: 2,
  height: 52,
  background: globalThemeColorVars.textInverse,
  borderRadius: 2,

  "@media": {
    "screen and (max-width: 768px)": {
      display: "none",
    },
  },
});

export const tryButtonInfoTextStyles = style({
  textAlign: "center",
  color: globalThemeColorVars.textInverse,
  fontSize: 18,
  fontWeight: 600,

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: 12,
    },
  },
});

export const tryButtonHighlightTextStyles = style([
  tryButtonInfoTextStyles,
  {
    color: globalThemeColorVars.primary,
  },
]);
