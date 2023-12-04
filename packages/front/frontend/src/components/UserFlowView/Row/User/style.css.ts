import { style } from "@vanilla-extract/css";
import { globalThemeColorVars, subtitle1regularStyles } from "@app/ui-kit";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
});

export const deadlineStyles = style([
  subtitle1regularStyles,
  {
    color: globalThemeColorVars.textSecondary,
    marginTop: 3,
    maxWidth: 800,
  },
]);

export const actionsWrapperStyles = style({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
});

export const rowStyles = style({
  gap: 12,
  alignItems: "flex-start",
  display: "inline-flex",
});

export const resultStyles = style({
  marginTop: 20,
});
