import { style } from "@vanilla-extract/css";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  width: 480,
});

export const contentWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 16,
});
