import { style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "@app/ui-kit";

export const infoStyles = style({
  display: "flex",
  alignItems: "center",
  gap: 2,
  color: globalThemeColorVars.textSecondary,
});
