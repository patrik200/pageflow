import { style } from "@vanilla-extract/css";

import { spinnerExtra, spinnerLarge, spinnerMedium, spinnerSmall } from "primitives/Spinner/theme.css";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

export const spinnerSmallStyles = spinnerSmall.className;
export const spinnerMediumStyles = spinnerMedium.className;
export const spinnerLargeStyles = spinnerLarge.className;
export const spinnerExtraStyles = spinnerExtra.className;
