import { style } from "@vanilla-extract/css";
import { spinnerLarge } from "@app/ui-kit";

export const spinnerStyles = style([spinnerLarge.className]);

export const titleStyles = style({
  marginBottom: 0,
  wordBreak: "break-word",
  maxWidth: 530,
});
