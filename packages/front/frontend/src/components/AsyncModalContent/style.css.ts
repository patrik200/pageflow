import { style } from "@vanilla-extract/css";
import { spinnerExtra } from "@app/ui-kit";

export const spinnerWrapperStyles = style({
  position: "relative",
  padding: 32,
});

export const spinnerStyles = style([spinnerExtra.className]);
