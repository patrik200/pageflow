import { style } from "@vanilla-extract/css";
import { body2regularStyles, globalThemeColorVars, h4mediumStyles } from "@app/ui-kit";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 20,
});

export const topWrapperStyles = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
});

export const nameStyles = style([h4mediumStyles]);

export const progressBarStyles = style({
  width: 55,
  alignSelf: "center",
});

export const progressBarWrapperStyles = style({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
});

export const rowsWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 18,
});

export const titleStyles = style({
  display: "flex",
  gap: 12,
});

export const reviewerStyles = style({
  display: "flex",
  gap: 12,
  paddingTop: 18,
});

export const reviewerPlaceholderTextStyles = style([
  body2regularStyles,
  {
    color: globalThemeColorVars.textSecondary,
  },
]);

export const reviewerActionsWrapperStyles = style({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
});
