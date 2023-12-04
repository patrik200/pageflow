import { style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "@app/ui-kit";

export const userWrapperStyles = style({
  display: "flex",
  gap: 16,
  alignItems: "center",
});

export const checkIconStyles = style({
  color: globalThemeColorVars.green,
});
