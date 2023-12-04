import { style } from "@vanilla-extract/css";
import { margin } from "polished";
import { h4mediumStyles, spinnerMedium } from "@app/ui-kit";

export const cardStyles = style({
  gap: 8,
  paddingBottom: 12,
});

export const titleWrapperStyles = style({
  display: "flex",
  alignItems: "center",
  gap: 12,
});

export const titleStyles = style([h4mediumStyles]);

export const titleSpinnerStyles = style([spinnerMedium.className]);

export const preContentStyles = style({
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
});

export const breadcrumbsStyles = style({
  margin: -4,
});

export const actionsWrapperStyles = style({
  display: "flex",
  alignItems: "center",
  gap: 8,
});

export const contentStyles = style({
  display: "flex",
  flexDirection: "column",
  ...margin(null, -16),
});
