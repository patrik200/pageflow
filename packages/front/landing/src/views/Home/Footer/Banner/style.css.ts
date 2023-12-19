import { style } from "@vanilla-extract/css";
import { padding } from "polished";

import { globalThemeColorVars } from "styles";

export const bannerWrapperStyles = style({
  height: 372,
  width: "100%",
  background: 'url("/images/blocks/footer/index.jpg")',
  backgroundPosition: "50%",
  backgroundSize: "cover",
  borderRadius: 24,
  display: "flex",
  justifyContent: "center",
});

export const contentStyles = style({
  maxWidth: 1120,
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 20,
  ...padding(0, 16),

  "@media": {
    "screen and (max-width: 768px)": {
      flexDirection: "column",
      justifyContent: "center",
    },
  },
});

export const titleTextStyles = style({
  fontSize: 48,
  lineHeight: "110%",
  letterSpacing: "1%",
  color: globalThemeColorVars.textInverse,

  "@media": {
    "screen and (max-width: 768px)": {
      maxWidth: 400,
      fontSize: 24,
      textAlign: "center",
    },
  },
});

export const buttonStyles = style({
  borderRadius: 8,
  background: globalThemeColorVars.primary,
  ...padding(12, 24),
  color: globalThemeColorVars.textInverse,
  border: 0,
  outline: 0,
  cursor: "pointer",
  lineHeight: "160%",
  zIndex: 0,
  position: "relative",
  fontSize: 18,
});

export const underButtonTextStyles = style({
  lineHeight: "140%",
  fontSize: 18,
  marginTop: 15,
  color: globalThemeColorVars.textInverse,
  zIndex: 0,
  position: "relative",

  "@media": {
    "screen and (max-width: 768px)": {
      textAlign: "center",
      fontSize: 14,
    },
  },
});

export const tryWrapperStyles = style({
  position: "relative",

  "@media": {
    "screen and (max-width: 768px)": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
  },
});

export const tryWrapperShadowStyles = style({
  zIndex: 0,
  position: "absolute",
  left: "50%",
  top: "50%",
  width: "200%",
  height: "200%",
  transform: "translate(-55%, -50%)",
  background: "radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.52) 0%, rgba(0, 0, 0, 0.00) 100%)",
  filter: "blur(26px)",

  "@media": {
    "screen and (max-width: 768px)": {
      width: "100%",
      height: "100%",
    },
  },
});
