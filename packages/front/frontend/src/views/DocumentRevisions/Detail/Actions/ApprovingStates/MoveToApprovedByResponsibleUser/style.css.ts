import { style } from "@vanilla-extract/css";
import { body2regularStyles, buttonBackgroundVar, globalThemeColorVars } from "@app/ui-kit";

export const buttonStyles = style({
  vars: {
    [buttonBackgroundVar]: globalThemeColorVars.green,
  },
});

export const hasUnresolvedCommentTooltipTextStyles = style([body2regularStyles]);
