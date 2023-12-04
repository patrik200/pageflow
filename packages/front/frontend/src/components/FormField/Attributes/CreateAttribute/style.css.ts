import { style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "@app/ui-kit";

export const buttonStyles = style({
  cursor: "pointer",
  width: 22,
  height: 22,
  padding: 4,
  color: globalThemeColorVars.textPrimary,
});
