import { style } from "@vanilla-extract/css";

export const cardStyles = style({
  flexDirection: "row",
  gap: 24,
});

export const contentWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  flex: 1,
});
