import { style } from "@vanilla-extract/css";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  flex: 1,
});

export const userRowStyles = style({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 16,
});

export const userRowUserFieldStyles = style({
  flex: 1,
});

export const userRowRoleFieldStyles = style({
  flex: 0.7,
  minWidth: 167,
});

export const actionsWrapperStyles = style({
  display: "flex",
  justifyContent: "flex-end",
});
