import { style } from "@vanilla-extract/css";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 16,
});

export const imageWrapperStyles = style({
  width: 290,
  height: 100,
});

export const imageStyles = style({
  width: 100,
  height: 100,
});
