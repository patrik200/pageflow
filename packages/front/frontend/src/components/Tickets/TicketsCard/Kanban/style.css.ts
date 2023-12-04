import { style } from "@vanilla-extract/css";

export const scrollStyles = style({
  width: 0,
  flex: 1,
});

export const scrollContentStyles = style({
  display: "grid",
  gap: 16,
  height: "100%",
});
