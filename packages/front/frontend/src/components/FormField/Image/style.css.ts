import { style, styleVariants } from "@vanilla-extract/css";

export const editWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 4,
  flex: 1,
});

export const contentStyles = style({
  display: "flex",
  alignItems: "flex-start",
  gap: 16,
});

export const imageStyleVariants = styleVariants({
  view: { width: 140, borderRadius: 6 },
  edit: { width: 60, borderRadius: 6 },
});

export const actionsWrapperStyles = style({
  display: "flex",
  alignItems: "center",
  gap: 8,
});
