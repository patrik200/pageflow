import { style } from "@vanilla-extract/css";

import { body1regularStyles } from "primitives/Typography/css/index.css";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 24,
  padding: 48,
});

export const buttonStyles = style({
  alignSelf: "flex-start",
});
export const textStyles = style([body1regularStyles]);
