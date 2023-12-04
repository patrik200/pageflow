import { globalThemeColorVars, buttonBackgroundVar } from "@app/ui-kit";
import { style } from "@vanilla-extract/css";

export const buttonStyles = style({
  vars: {
    [buttonBackgroundVar]: globalThemeColorVars.red,
  },
});
