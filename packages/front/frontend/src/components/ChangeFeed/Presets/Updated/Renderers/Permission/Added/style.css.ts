import { style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "@app/ui-kit";

export const wrapperStyles = style({
  display: "flex",
  alignItems: "center",
  gap: 20,
});

export const iconStyles = style({
  width: 14,
  height: 14,
  color: globalThemeColorVars.primary,
  flexShrink: 0,
});
