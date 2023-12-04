import { padding } from "polished";
import { style, styleVariants } from "@vanilla-extract/css";
import { globalThemeColorVars } from "styles";

import { body3mediumStyles, typographyOptionalStyleVariants } from "primitives/Typography/css/index.css";

import { BadgeColorVariants } from "./variants";

export const wrapperStyles = style({
  display: "flex",
  borderRadius: 4,
  gap: 4,
  alignItems: "center",
});

export const sizeStyleVariants = styleVariants({
  default: { ...padding(3, 6) },
});

export const themeStyleVariants = styleVariants({
  [BadgeColorVariants.INFO]: { background: globalThemeColorVars.green10, color: globalThemeColorVars.green },
  [BadgeColorVariants.WARNING]: { background: globalThemeColorVars.orange10, color: globalThemeColorVars.orange },
  [BadgeColorVariants.ALARM]: { background: globalThemeColorVars.red10, color: globalThemeColorVars.red },
});

export const iconStyles = style({
  flexShrink: 0,
  color: "inherit",
});

export const iconSizeStyleVariants = styleVariants({
  default: { width: 16, height: 16 },
});

export const textStyles = style([
  typographyOptionalStyleVariants.noWrap,
  {
    color: "inherit",
  },
]);

export const textSizeStyleVariants = styleVariants({
  default: [body3mediumStyles],
});
