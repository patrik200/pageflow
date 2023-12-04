import { style } from "@vanilla-extract/css";
import { body3regularStyles, globalThemeColorVars } from "@app/ui-kit";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 10,
});

export const titleWrapperStyles = style({
  display: "flex",
  alignItems: "center",
  gap: 12,
  justifyContent: "space-between",
  minHeight: 34,
});

export const titleInfoStyles = style({
  display: "flex",
  alignItems: "center",
  gap: 20,
});

export const timesWrapperStyles = style({
  display: "flex",
  alignItems: "center",
  gap: 8,
});

export const timeTextStyles = style([body3regularStyles, { color: globalThemeColorVars.textSecondary }]);

export const actionsWrapperStyles = style({
  display: "flex",
  alignItems: "center",
  gap: 8,
});

export const contentWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 12,
});
