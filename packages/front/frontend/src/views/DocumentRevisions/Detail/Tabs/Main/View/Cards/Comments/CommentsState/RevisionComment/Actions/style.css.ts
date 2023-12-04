import { style } from "@vanilla-extract/css";
import { body2regularStyles } from "@app/ui-kit";

export const wrapperStyles = style({
  display: "flex",
  alignItems: "center",
  gap: 24,
});

export const statusWrapperStyles = style({
  display: "flex",
  alignItems: "center",
  gap: 16,
});

export const statusTitleStyles = style([body2regularStyles]);
