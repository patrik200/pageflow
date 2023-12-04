import { style } from "@vanilla-extract/css";

export const attachmentsWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

export const actionsWrapperStyles = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 8,
});
