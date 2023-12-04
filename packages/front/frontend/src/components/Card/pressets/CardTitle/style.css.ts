import { style, styleVariants } from "@vanilla-extract/css";
import { h2boldStyles, h3mediumStyles, h4mediumStyles } from "@app/ui-kit";
import { margin } from "polished";

export const cardSizeStyleVariants = styleVariants({
  default: { gap: 16 },
  medium: { gap: 16 },
  small: { gap: 10 },
});

export const topContentWrapperStyles = style({
  display: "flex",
  alignItems: "flex-start",
  gap: 24,
  justifyContent: "space-between",
});

export const titleWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 10,
});

export const breadcrumbsStyles = style({
  ...margin(-4, -8),
});

export const titleContentStyles = style({
  display: "flex",
  gap: 6,
  alignItems: "flex-start",
});

export const titleSizeStyleVariants = styleVariants({
  default: [h2boldStyles],
  medium: [h3mediumStyles],
  small: [h4mediumStyles],
});

export const actionsWrapperStyles = style({
  display: "flex",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
  justifyContent: "flex-end",
});

export const dividerStyles = style({
  marginRight: -16,
});
