import { style } from "@vanilla-extract/css";
import { padding } from "polished";

export const logoWrapperStyles = style({
  ...padding(16, null, 16, 12),
});

export const logoStyles = style({
  width: 190,
  height: 35,
});
