import { style, styleVariants } from "@vanilla-extract/css";
import { padding } from "polished";
import { globalThemeColorVars } from "styles";

import { body2regularStyles, typographyOptionalStyleVariants } from "primitives/Typography/css/index.css";

export const cellStyles = style({
  ...padding(8, null),
});

export const cellWithOrderStyles = style({ cursor: "pointer" });

export const textStyles = style([
  body2regularStyles,
  typographyOptionalStyleVariants.noWrap,
  {
    color: globalThemeColorVars.textSecondary,
    display: "flex",
    alignItems: "center",
    transition: "color 0.2s",
  },
]);
export const textWithActiveOrderStyles = style({
  color: globalThemeColorVars.textPrimary,
});

export const positionStyleVariants = styleVariants({
  left: { textAlign: "left" },
  center: { textAlign: "center" },
  right: { textAlign: "right" },
});

export const iconStyles = style({ height: 12, flexShrink: 0 });

export const iconNoneStyles = style({
  transition: "width 0.2s, margin-left 0.2s",
  opacity: 0,
  width: 0,
  marginLeft: 0,
});
export const iconASCStyles = style({
  transition: "width 0.2s, margin-left 0.2s, opacity 0.2s, transform 0.2s",
  transform: "rotateZ(0deg)",
  opacity: 1,
  width: 12,
  marginLeft: 4,
});
export const iconDESCStyles = style({
  transition: "width 0.2s, margin-left 0.2s, opacity 0.2s, transform 0.2s",
  transform: "rotateZ(180deg)",
  opacity: 1,
  width: 12,
  marginLeft: 4,
});
