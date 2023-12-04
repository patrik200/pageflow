import { style } from "@vanilla-extract/css";

import { h3mediumStyles } from "primitives/Typography/css/index.css";

export const wrapperStyles = style({
  marginTop: 8,
});

export const textStyles = style([h3mediumStyles]);
