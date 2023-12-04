import { style } from "@vanilla-extract/css";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: 16,
});

export const blockStyles = style({
  display: "flex",
  gap: 24,
});
