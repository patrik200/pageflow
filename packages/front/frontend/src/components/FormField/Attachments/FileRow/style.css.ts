import { style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "@app/ui-kit";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 4,
});

export const contentWrapperStyles = style({
  display: "flex",
  gap: 12,
  alignItems: "center",
});

export const removeButtonStyles = style({ flexShrink: 0 });
export const removeButtonIconStyles = style({
  color: globalThemeColorVars.textSecondary,
  padding: 1,
});
