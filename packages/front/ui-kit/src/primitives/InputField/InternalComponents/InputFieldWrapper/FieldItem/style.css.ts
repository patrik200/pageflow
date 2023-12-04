import { globalStyle, style, styleVariants } from "@vanilla-extract/css";
import { globalThemeColorVars } from "styles";

export const itemStyles = style({
  display: "flex",
  color: globalThemeColorVars.textPrimary,
});

export const itemStyleDefaultVariants = styleVariants({
  left: { marginRight: 10 },
  right: { marginLeft: 10 },
});

export const itemStyleSmallVariants = styleVariants({
  left: { marginRight: 8 },
  right: { marginLeft: 8 },
});

export const itemSizeStyleVariants = styleVariants({
  small: {},
  default: {},
});

globalStyle(`${itemSizeStyleVariants.small} .icon`, { scale: "0.9" });
