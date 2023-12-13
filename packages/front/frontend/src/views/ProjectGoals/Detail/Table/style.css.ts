import { style } from "@vanilla-extract/css";

export const hidenWrapperStyles = style({
  transition: "height 0.2s, margin-top 0.2s, opacity 0.2s",
  opacity: 0,
  overflow: "hidden",
});

export const wrapperStyles = style({
  opacity: 1,
  overflow: "visible",
});
