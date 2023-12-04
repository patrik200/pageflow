import { style } from "@vanilla-extract/css";

export const wrapperStyles = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 24,
  alignItems: "flex-start",
});
