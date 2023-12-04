import { style } from "@vanilla-extract/css";

export const filterButtonIconStyles = style({
  transition: "transform 0.2s",
});

export const filterButtonIconOpenedStyles = style({
  transform: "rotateZ(180deg)",
});
