import { createVar, style, styleVariants } from "@vanilla-extract/css";
import { padding } from "polished";
import { globalThemeColorVars } from "styles";

import { body2regularStyles } from "primitives/Typography/css/index.css";

export const detectorLeftVar = createVar();

const commonPositionStyles = style({
  position: "absolute",
  left: 0,
  transform: "translateY(-50%)",
  padding: 0,
});

export const textStyles = style([
  body2regularStyles,
  commonPositionStyles,
  { color: globalThemeColorVars.textSecondary },
]);

export const textSizeStyleVariants = styleVariants({
  default: { top: 21 },
  small: { top: 16 },
});

export const textAnimationStyles = style({
  transition: "all 0.2s",
});

export const focusedDefaultTextStyles = style({ opacity: 0, display: "none" });

export const focusedMaterialTextStyles = style({
  top: -2,
  lineHeight: "14px",
  left: detectorLeftVar,
  ...padding(null, 6),
  background: globalThemeColorVars.backgroundCard,
});

export const focusedMaterialTextLeftStyleVariants = styleVariants({
  withInformer: { marginLeft: 32 },
  withoutInformer: { marginLeft: 10 },
});

export const requiredAsteriskStyle = style({
  color: globalThemeColorVars.red,
  display: "inline",
  marginLeft: 2,
});

export const informerStyles = style([
  commonPositionStyles,
  {
    background: globalThemeColorVars.backgroundCard,
    color: globalThemeColorVars.textSecondary,
    top: -1,
    left: detectorLeftVar,
    height: 22,
    width: 28,
    marginLeft: 10,
    zIndex: 1,
    ...padding(4, 8, 4, 6),
  },
]);
