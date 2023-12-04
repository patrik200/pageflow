import { style } from "@vanilla-extract/css";

import { body1regularStyles } from "primitives/Typography/css/index.css";

export const wrapperStyle = style({
  display: "flex",
  gap: 32,
});

export const switchesWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  padding: 12,
});

export const textStyles = style([body1regularStyles]);
