import { style } from "@vanilla-extract/css";
import { padding } from "polished";

import { body2regularStyles } from "primitives/Typography/css/index.css";

export const inputStyles = style([
  body2regularStyles,
  {
    width: "100%",
    height: "100%",
    outline: "none",
    border: "none",
    padding: 0,
    appearance: "none",
    background: "transparent",
    minHeight: "100%",
    color: "currentColor",
    resize: "none",
  },
]);

export const textCenterStyles = style({ textAlign: "center" });

export const textAreaStyles = style({
  ...padding(11, 8, 8, null),
});

export const wrapperStyles = style({
  flex: 1,
  height: "100%",
  position: "relative",
});
