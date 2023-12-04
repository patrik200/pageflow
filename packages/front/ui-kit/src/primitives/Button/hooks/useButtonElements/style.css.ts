import { style, styleVariants } from "@vanilla-extract/css";

import { spinnerColorVar, spinnerSmall } from "primitives/Spinner/theme.css";

export const customJSXElementIconContainerStyle = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const iconButtonSizeStyleVariants = styleVariants({
  EXTRA_SMALL: { width: 12, height: 12 },
  SMALL: { width: 14, height: 14 },
  MEDIUM: { width: 16, height: 16 },
});

export const iconButtonLeftSizeStyleVariants = styleVariants({
  EXTRA_SMALL: { marginRight: 6 },
  SMALL: { marginRight: 8 },
  MEDIUM: { marginRight: 12 },
});

export const iconButtonRightSizeStyleVariants = styleVariants({
  EXTRA_SMALL: { marginLeft: 6 },
  SMALL: { marginLeft: 8 },
  MEDIUM: { marginLeft: 12 },
});

export const spinnerStyles = style([spinnerSmall.className, { vars: { [spinnerColorVar]: "currentColor" } }]);
