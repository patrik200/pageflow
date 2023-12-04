import { style, styleVariants } from "@vanilla-extract/css";

export const wrapperStyles = style({
  display: "flex",
  gap: 16,
  alignItems: "flex-start",
});

export const cardStyles = style({
  position: "sticky",
  top: 16,
});

export const mainCardStyles = style({
  flex: 1,
});

export const additionalCardStyleVariants = styleVariants({
  enabled: { flex: 0.8 },
  disabled: { width: 380 },
});
