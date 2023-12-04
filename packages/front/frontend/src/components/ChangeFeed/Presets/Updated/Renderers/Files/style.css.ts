import { style } from "@vanilla-extract/css";
import { body2regularStyles, globalThemeColorVars } from "@app/ui-kit";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 2,
});

export const fileWrapperStyles = style({
  display: "flex",
  alignItems: "center",
  gap: 6,
});

const fileNameStyles = style([body2regularStyles]);

export const newFileNameStyles = style([fileNameStyles]);
export const newFileIconStyles = style({
  width: 15,
  height: 15,
  color: globalThemeColorVars.textSecondary,
  marginTop: 2,
});

export const deletedFileNameStyles = style([
  fileNameStyles,
  { color: globalThemeColorVars.textSecondary, textDecoration: "line-through" },
]);
