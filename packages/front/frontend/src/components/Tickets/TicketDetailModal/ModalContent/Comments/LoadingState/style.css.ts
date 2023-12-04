import { style } from "@vanilla-extract/css";
import { spinnerExtra } from "@app/ui-kit";

export const spinnerWrapperStyles = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 48,
});

export const spinnerStyles = style([spinnerExtra.className]);
