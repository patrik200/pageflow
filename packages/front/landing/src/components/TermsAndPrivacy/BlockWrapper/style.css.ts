import { style } from "@vanilla-extract/css";
import { padding } from "polished";

export const blockWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  ...padding(0, 10),
});
