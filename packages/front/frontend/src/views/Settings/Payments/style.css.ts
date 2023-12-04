import { style } from "@vanilla-extract/css";
import { spinnerLarge } from "@app/ui-kit";

export const spinnerStyles = style([spinnerLarge.className]);

export const wrapperStyles = style({
  display: "flex",
  gap: 24,
  flexDirection: "column",
});
