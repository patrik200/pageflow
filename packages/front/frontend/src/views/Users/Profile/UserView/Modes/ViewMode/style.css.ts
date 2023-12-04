import { body2regularStyles } from "@app/ui-kit";
import { style } from "@vanilla-extract/css";

export const linkStyles = style([body2regularStyles]);

export const actionsWrapperStyles = style({
  display: "flex",
  alignItems: "center",
  gap: 16,
});
