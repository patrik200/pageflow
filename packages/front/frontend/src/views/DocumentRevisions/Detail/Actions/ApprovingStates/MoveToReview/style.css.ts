import { style } from "@vanilla-extract/css";
import { buttonBackgroundVar, globalThemeColorVars } from "@app/ui-kit";

export const buttonStyles = style({
  vars: {
    [buttonBackgroundVar]: globalThemeColorVars.green,
  },
});
