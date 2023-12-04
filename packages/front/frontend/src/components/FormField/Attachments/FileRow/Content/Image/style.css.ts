import { style } from "@vanilla-extract/css";

export const wrapperStyles = style({
  display: "flex",
  flex: 1,
});

export const imageStyles = style({
  maxWidth: 250,
  maxHeight: 150,
  flexShrink: 0,
  borderRadius: 8,
});
