import { globalStyle, style } from "@vanilla-extract/css";
import { body1medium, globalThemeColorVars, typographyOptionalStyleVariants } from "@app/ui-kit";

export const columnStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  minWidth: 197,
  paddingRight: 16,
});

globalStyle(`${columnStyles}:not(:last-child)`, {
  borderRight: `1px solid ${globalThemeColorVars.strokeLight}`,
});

export const columnTitleStyles = style([
  body1medium,
  typographyOptionalStyleVariants.noWrap,
  {
    color: globalThemeColorVars.textSecondary,
  },
]);

export const columnItemsStyles = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
});
