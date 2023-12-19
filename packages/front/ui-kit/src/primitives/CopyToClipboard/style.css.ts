import { style } from "@vanilla-extract/css";

import { body2regularStyles } from "primitives/Typography/css/index.css";

export const tooltipTextStyles = style([body2regularStyles, { display: "block" }]);

export const hiddenTooltipPopupStyles = style({
  visibility: "hidden",
});

export const childrenStyles = style({
  cursor: "pointer",
});
