import { size } from "polished";
import { style } from "@vanilla-extract/css";

import { body1regularStyles } from "primitives/Typography/css/index.css";

export const wrapperStyles = style({
  marginTop: 20,
  marginBottom: 24,
  gap: 16,
  display: "flex",
  flexDirection: "column",
});

export const eyeIconStyles = style({
  cursor: "pointer",
  ...size(28),
  padding: 4,
});

export const calendarWrapperStyles = style({
  marginTop: 16,
  display: "flex",
  gap: 8,
});

export const datePickerStyles = style({
  width: 300,
});

export const tooltipIconStyles = style({ cursor: "pointer" });
export const tooltipTextStyles = style([body1regularStyles, { maxWidth: 418, minWidth: 300 }]);
