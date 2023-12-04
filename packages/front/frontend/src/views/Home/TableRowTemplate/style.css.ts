import { style } from "@vanilla-extract/css";
import { body1regularStyles } from "@app/ui-kit";
import { padding } from "polished";

export const wrapperStyles = style({
  display: "flex",
  gap: 12,
  ...padding(2, 16),
});

export const titleStyles = style([
  body1regularStyles,
  {
    flex: 1,
  },
]);
