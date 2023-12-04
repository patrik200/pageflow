import { style } from "@vanilla-extract/css";
import { body2regularStyles } from "@app/ui-kit";

export const addButtonWrapperStyles = style({
  alignSelf: "flex-start",
});

export const disabledTooltipTextStyles = style([body2regularStyles]);
