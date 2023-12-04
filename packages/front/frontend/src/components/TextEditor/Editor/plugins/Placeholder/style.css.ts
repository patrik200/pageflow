import { style } from "@vanilla-extract/css";
import { body2regularStyles } from "@app/ui-kit";

export const placeholderStyles = style([
  body2regularStyles,
  {
    position: "absolute",
    left: 12,
    top: 12,
  },
]);
