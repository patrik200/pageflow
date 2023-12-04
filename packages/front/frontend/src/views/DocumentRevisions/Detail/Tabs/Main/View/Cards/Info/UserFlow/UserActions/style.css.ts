import { style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "@app/ui-kit";

export const approvedIconStyles = style({
  color: globalThemeColorVars.green,
  marginTop: 4,
  marginBottom: -4,
});
