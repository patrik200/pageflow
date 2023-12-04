import { style } from "@vanilla-extract/css";

import { body1regularStyles } from "primitives/Typography/css/index.css";

export const wrapperStyles = style({
  flexWrap: "wrap",
  gap: "40px 20px",
  display: "flex",
});

export const colorStyles = style({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  padding: 8,
  height: 90,
});
export const colorTextStyles = style([body1regularStyles]);
