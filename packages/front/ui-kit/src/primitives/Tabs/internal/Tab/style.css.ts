import { createVar, fallbackVar, style } from "@vanilla-extract/css";
import { padding } from "polished";
import { globalThemeColorVars } from "styles";

import { body3mediumStyles, typographyOptionalStyleVariants } from "primitives/Typography/css/index.css";

export const horizontalPaddingVar = createVar();
export const verticalPaddingVar = createVar();
export const minWidthVar = createVar();

export const commonButtonStyles = style({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1,
  outline: "none",
  background: "transparent",
  cursor: "pointer",
  border: "none",
  ...padding(verticalPaddingVar, horizontalPaddingVar),
  minWidth: fallbackVar(minWidthVar, "auto"),
});

export const textStyles = style([
  typographyOptionalStyleVariants.noWrap,
  body3mediumStyles,
  {
    textTransform: "uppercase",
    color: globalThemeColorVars.textSecondary,
    transition: "color 200ms",
  },
]);

export const textActive = style({
  color: globalThemeColorVars.primary,
});
