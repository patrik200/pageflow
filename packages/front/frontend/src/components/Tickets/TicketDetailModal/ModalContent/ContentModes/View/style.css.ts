import { style } from "@vanilla-extract/css";

export const containerStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 12,
  flex: 1,
  minWidth: 800,
  maxWidth: 800,
});
