import { style, styleVariants } from "@vanilla-extract/css";
import { globalThemeColorVars } from "styles";

import { subtitle1regularStyles } from "primitives/Typography/css/index.css";

export const wrapperStyles = style([
  subtitle1regularStyles,
  {
    transition: "all 0.2s",
    display: "flex",
    color: globalThemeColorVars.textPrimary,
  },
]);

export const wrapperCenterStyles = style({ alignItems: "center" });

export const wrapperActiveStyles = style({
  cursor: "pointer",
  selectors: { "&:hover": { opacity: 0.7 } },
});

export const wrapperDisabledStyles = style({ opacity: 0.36 });

export const contentStyles = style({ flex: 1 });

export const checkWrapperStyles = style({
  flexShrink: 0,
  width: 36,
  height: 20,
  transition: "background 0.2s",
  borderRadius: 20,
  position: "relative",
});

export const checkWrapperPositionStyleVariants = styleVariants({
  left: { marginRight: 10 },
  right: { marginLeft: 10 },
});

export const checkWrapperPositionStyles = style({ marginTop: 3 });

export const checkWrapperInactiveStyle = style({
  background: globalThemeColorVars.background,
});

export const checkWrapperActiveStyle = style({ background: globalThemeColorVars.primary10 });

export const checkStyles = style({
  position: "absolute",
  width: 16,
  height: 16,
  transition: "background 0.2s, left 0.2s",
  top: 2,
  borderRadius: "100%",
});

export const checkInactiveStyles = style({
  background: globalThemeColorVars.strokeLight,
  left: 2,
});

export const checkActiveStyles = style({
  background: globalThemeColorVars.primary,
  left: "calc(50%)",
});
