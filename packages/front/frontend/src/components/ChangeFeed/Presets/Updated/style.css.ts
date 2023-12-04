import { style } from "@vanilla-extract/css";
import { body2regularStyles, globalThemeColorVars } from "@app/ui-kit";

export const rowsWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 10,
});

export const rowWrapperStyles = style({
  display: "flex",
  gap: 20,
  alignItems: "flex-start",
});

export const rowTitleStyles = style([
  body2regularStyles,
  {
    color: globalThemeColorVars.textSecondary,
    width: 200,
    whiteSpace: "pre-wrap",
  },
]);

export const rowItemsWrapperStyles = style({
  display: "flex",
  alignItems: "flex-start",
  gap: 20,
  flex: 1,
});

export const rowItemsWrapperSeparatorIconStyles = style({
  width: 14,
  height: 14,
  color: globalThemeColorVars.primary,
  flexShrink: 0,
  marginTop: 2,
});
