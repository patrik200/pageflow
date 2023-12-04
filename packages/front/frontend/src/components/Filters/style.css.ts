import { style } from "@vanilla-extract/css";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
});

export const primaryRowStyles = style({
  display: "flex",
  gap: 16,
  alignItems: "center",
});

export const filterButtonWrapperStyles = style({
  display: "flex",
  flex: 1,
  justifyContent: "flex-end",
});

export const secondaryRowSystemStyles = style({
  transition: "height 0.2s, margin-top 0.2s, opacity 0.2s",
  opacity: 0,
  overflow: "hidden",
});

export const secondaryRowOpenedSystemStyles = style({
  opacity: 1,
  marginTop: 16,
  overflow: "visible",
});

export const secondaryRowsWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 16,
});

export const secondaryRowStyles = style({
  display: "flex",
  gap: 24,
});
