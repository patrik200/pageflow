import { style } from "@vanilla-extract/css";
import { padding } from "polished";

export const modalHeaderStyles = style({
  ...padding(16, 24),
  display: "flex",
  width: "100%",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 16,
});
