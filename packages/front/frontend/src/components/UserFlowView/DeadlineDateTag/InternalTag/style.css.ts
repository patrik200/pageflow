import { style } from "@vanilla-extract/css";
import { subtitle1regularStyles, globalThemeColorVars, typographyOptionalStyleVariants } from "@app/ui-kit";

export const wrapperStyles = style({
  display: "flex",
  gap: 8,
  alignItems: "center",
});

export const descriptionStyles = style([
  subtitle1regularStyles,
  typographyOptionalStyleVariants.noWrap,
  {
    color: globalThemeColorVars.textSecondary,
  },
]);
