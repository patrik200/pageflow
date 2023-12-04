import { style } from "@vanilla-extract/css";

export const wrapperStyles = style({
  display: "flex",
  gap: 16,
  alignItems: "flex-start",
});

export const mainWrapperStyles = style({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 16,
});

export const additionalWrapperStyles = style({
  width: 390,
});
