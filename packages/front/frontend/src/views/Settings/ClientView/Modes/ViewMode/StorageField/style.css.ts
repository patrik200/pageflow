import { body2regularStyles } from "@app/ui-kit";
import { style } from "@vanilla-extract/css";

export const storageWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  maxWidth: 300,
});

export const storageTextWrapperStyles = style({
  display: "flex",
  justifyContent: "space-between",
});

export const storageTextStyles = style([body2regularStyles]);
