import { style } from "@vanilla-extract/css";

import { body1regularStyles } from "primitives/Typography/css/index.css";

export const textStyles = body1regularStyles;

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 32,
});
