import { style } from "@vanilla-extract/css";
import { body2regularStyles, globalThemeColorVars } from "@app/ui-kit";

export const iconStyles = style({
  width: 20,
  height: 20,
  color: globalThemeColorVars.textSecondary,
});

export const hasUnresolvedCommentTooltipTextStyles = style([body2regularStyles]);
