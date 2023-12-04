import { style } from "@vanilla-extract/css";

import { h4mediumStyles } from "primitives/Typography/css/index.css";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  marginBottom: 28,
});

export const titleStyles = style([h4mediumStyles]);
