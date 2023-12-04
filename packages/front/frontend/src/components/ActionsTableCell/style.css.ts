import { style, styleVariants } from "@vanilla-extract/css";

export const actionsTableCellWrapperStyles = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
});

export const wrapperSizeStyleVariants = styleVariants({
  "32": { width: 32 },
  "92": { width: 92 },
  "122": { width: 122 },
  "160": { width: 160 },
});
