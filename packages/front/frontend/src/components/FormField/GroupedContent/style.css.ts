import { style, styleVariants } from "@vanilla-extract/css";
import { h4mediumStyles } from "@app/ui-kit";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 16,
});

export const wrapperSizeStyleVariants = styleVariants({
  default: { maxWidth: 660 },
  extra: { maxWidth: 840 },
  unlimited: {},
});

export const titleWrapperStyles = style({
  display: "flex",
  alignItems: "flex-start",
  gap: 8,
  justifyContent: "space-between",
});

export const titleStyles = style([h4mediumStyles]);

export const contentWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 12,
  flex: 1,
});
