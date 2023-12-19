import { style } from "@vanilla-extract/css";
import { body2regularStyles } from "@app/ui-kit";

export const wrapperStyles = style({
  minWidth: 450,
  display: "flex",
  flexDirection: "column",
  gap: 16,
});

export const slugInformerTooltipTextStyles = style([body2regularStyles, { whiteSpace: "pre-wrap" }]);
