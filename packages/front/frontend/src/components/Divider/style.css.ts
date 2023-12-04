import { globalThemeColorVars } from "@app/ui-kit";
import { style, styleVariants } from "@vanilla-extract/css";

export const dividerCommonStyle = style({
  background: globalThemeColorVars.strokeLight,
});

export const dividerVariants = styleVariants({
  vertical: { width: 1 },
  horizontal: { height: 1 },
});

export const dividerFitStyleVariants = styleVariants({
  vertical: { height: "100%" },
  horizontal: { width: "100%" },
});
