import { style } from "@vanilla-extract/css";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "row",
  marginTop: 6,
  gap: 16,
  flex: 1,
});

export const typeFieldStyles = style({
  flex: 0.6,
});

export const ticketFieldStyles = style({
  flex: 1,
});

export const actionsWrapperStyles = style({
  alignItems: "center",
  marginTop: 4,
});
