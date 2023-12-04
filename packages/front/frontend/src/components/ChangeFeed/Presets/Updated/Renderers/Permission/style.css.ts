import { globalStyle, style } from "@vanilla-extract/css";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 2,
});

globalStyle(`${wrapperStyles}:empty`, {
  display: "none",
});
