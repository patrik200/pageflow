import { style } from "@vanilla-extract/css";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 12,
});

export const bottomWrapperStyles = style({
  display: "flex",
  gap: 24,
  justifyContent: "space-between",
});

export const attachmentsWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  minWidth: 380,
});
