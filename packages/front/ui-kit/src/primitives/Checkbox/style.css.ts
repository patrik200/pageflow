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

export const iconWrapperStyles = style({
  flexShrink: 0,
  width: 19,
  height: 19,
  transition: "all 0.2s",
  backgroundColor: "transparent",
  border: "2px solid " + globalThemeColorVars.strokeLight,
  color: globalThemeColorVars.primary,
});

export const iconWrapperPositionStyleVariants = styleVariants({
  left: { marginRight: 10 },
  right: { marginLeft: 10 },
});

export const iconWrapperPositionStyles = style({ marginTop: 3 });

export const checkIconWrapperStyle = style({
  borderRadius: 4,
});

export const radioIconWrapperStyle = style({
  borderRadius: "100%",
});

export const iconStyles = style({ width: "100%", height: "100%" });
export const iconRadioStyles = style({ scale: 0.8 });

export const contentStyles = style({ flex: 1 });
