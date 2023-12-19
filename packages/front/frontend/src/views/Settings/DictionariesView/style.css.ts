import { style } from "@vanilla-extract/css";
import { margin } from "polished";

export const wrapperStyles = style({
  ...margin(null, -8),
});

export const itemStyles = style({
  width: "33.33%",
  paddingLeft: 8,
  paddingRight: 8,
  paddingBottom: 16,
});
